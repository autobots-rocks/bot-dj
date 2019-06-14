import { Module }          from '@nestjs/common';
import { OAuthController } from './OAuthController';
import { OAuthService }    from './OAuthService';

@Module({

    imports: [

        // PassportModule.register({ defaultStrategy: 'jwt' }),
        //
        // JwtModule.register({
        //
        //     secretOrPrivateKey: 'secretKey',
        //     signOptions: {
        //
        //         expiresIn: 86400 * 7,
        //
        //     }
        //
        // })

    ],
    controllers: [

        OAuthController
    ],
    providers: [

        OAuthService
        // JwtStrategy

    ],
    exports: [

        // PassportModule,
        // AuthService

    ]

})

export class OAuthModule {
}
