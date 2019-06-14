import { Module }      from '@nestjs/common';
import { OAuthModule } from './oauth/OAuthModule';

@Module({

    imports: [

        OAuthModule,

    ],
    controllers: [],
    providers: [],

})
export class AppModule {

    public constructor() {

    }

}
