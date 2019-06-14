import { Controller, Get, Param, Query, Req, Res } from '@nestjs/common';
import { Request, Response }                       from 'express';
import { OAuthService }                            from './OAuthService';

@Controller('/dj/oauth')
export class OAuthController {

    public constructor(private oAuthService: OAuthService) {

    }

    @Get('/login')
    public sendMessage(@Res() res: Response): void {

        const scopes = 'user-read-private user-read-email';

        res.redirect(`https://accounts.spotify.com/authorize?response_type=code&client_id=${ process.env.SPOTIFY_CLIENT_ID }&scope=${ encodeURIComponent(scopes) }&redirect_uri=${ encodeURIComponent(process.env.SPOTIFY_OAUTH_REDIRECT) }`);

    }

    @Get('/callback')
    public async callback(@Query() query: any, @Param() params: any, @Req() req: Request) {

        if (query.code) {

            const result = await this.oAuthService.login(query.code);

            console.log(result);

            if (result) {

                return 'Logged in successfully! You can close this window now. :blaze:';

            } else {

                return 'could not oauth /tableflip';

            }

        }

    }

}
