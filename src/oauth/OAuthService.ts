import { BOT }        from '@autobot/common';
import { Injectable } from '@nestjs/common';
import { RichEmbed }  from "discord.js";
import * as request   from 'request';
import { filter }     from 'rxjs/operators';
import { ConfigUtil } from '../config/ConfigUtil';
import { OAuthToken } from './OAuthToken';

@Injectable()
export class OAuthService {

    public static readonly REFRESH_INTERVAL_SECONDS = 60000;

    public constructor() {

        console.log('Starting OAuthService.refreshStart()');

        this.refreshStart();

    }

    public async login(code: string) {

        try {

            const authOptions = {

                url: 'https://accounts.spotify.com/api/token',
                headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
                json: true,

                form: {

                    code,
                    redirect_uri: process.env.SPOTIFY_OAUTH_REDIRECT,
                    grant_type: 'authorization_code'

                }

            };

            const result: any = await new Promise((resolve, reject) => {

                request.post(authOptions, function (error, response, body) {

                    if (error) {

                        reject(error);

                    } else if (body.error) {

                        reject(body);

                    } else {

                        resolve(body);

                    }

                });

            });

            const date = new Date();

            date.setSeconds(date.getSeconds() + 3000);

            this.token = new OAuthToken(result.access_token, date, result.refresh_token);

            BOT.events$.next({

                name: 'refreshToken',
                payload: this.token

            });

            ConfigUtil.update('token', this.token.token);

            this.refreshStart();

            return true;

        } catch (e) {

            console.log('OAuthService.login() error: ', e);

            return false;

        }

    }

    public async refreshToken() {

        try {

            const authOptions = {

                url: 'https://accounts.spotify.com/api/token',
                headers: { 'Authorization': 'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')) },
                form: { grant_type: 'refresh_token', refresh_token: this.token.refresh },
                json: true

            };

            const result: any = await new Promise((resolve, reject) => {

                request.post(authOptions, function (error, response, body) {

                    if (error) {

                        reject(error);

                    } else if (body.error) {

                        reject(body);

                    } else {

                        resolve(body);

                    }

                });

            });

            const date = new Date();

            date.setSeconds(date.getSeconds() + 3000);

            this.token.token = result.access_token;
            this.token.expires = date;

            ConfigUtil.update('token', this.token.token);

            BOT.events$.next({

                name: 'refreshToken',
                payload: this.token

            });

            return result;

        } catch (e) {

            console.log('OAuthService.refreshToken() error: ', e);

        }

    }

    public token: OAuthToken;

    private interval: any;

    public async refreshStart() {

        this.refreshStop();

        const result = await this.refreshToken();

        if (!result) {

            BOT.events$.pipe(filter(event => event.name === BOT.EVENT_DISCORD_CONNECTED)).subscribe(() => {

                // @ts-ignore
                BOT.client.channels.get(process.env.DJBOT_TEXT_CHANNEL_ID).send(new RichEmbed().setTitle(process.env.DJBOT_NAME)
                                                                                               .setColor(15158332)
                                                                                               .setDescription(`OAuth token expired. Please login again: ${ process.env.DJBOT_OAUTH_LOGIN_URL }`));

            });

        }

        console.log('OAuthSerivce OAuth Refresh Interval Result: ', result);

        this.interval = setInterval(async () => {

            const result = await this.refreshToken();

            if (!result) {

                // @ts-ignore
                BOT.client.channels.get(process.env.DJBOT_TEXT_CHANNEL_ID).send(new RichEmbed().setTitle('dj bot')
                                                                                               .setColor(15158332)
                                                                                               .setDescription(`OAuth token expired. Please login again: ${ process.env.DJBOT_OAUTH_LOGIN_URL }`));

            }

            console.log('OAuthSerivce OAuth Refresh Interval Result: ', result);

        }, OAuthService.REFRESH_INTERVAL_SECONDS);

    }

    public refreshStop(): void {

        clearInterval(this.interval);

    }

}
