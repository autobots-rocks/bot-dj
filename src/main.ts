import { NestFactory } from '@nestjs/core';
import { AppModule }   from './app.module';
import { ConfigUtil }  from './config/ConfigUtil';

// @ts-ignore
async function bootstrap() {

    const app = await NestFactory.create(AppModule);

    await app.listen(process.env.PORT);

}

bootstrap();

const autobot = require('@autobot/common');

autobot.BOT.start(__dirname + '/..');

autobot.BOT.events$.next({

    name: 'config',
    payload: ConfigUtil.load()

});
