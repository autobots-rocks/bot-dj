export class OAuthToken {

    public token: string;
    public refresh: string;
    public expires: Date;

    public constructor(token: string, expires: Date, refresh?: string) {

        this.token = token;
        this.expires = expires;

        if (refresh) {

            this.refresh = refresh;

        }

    }

}
