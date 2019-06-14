import * as fs    from 'fs';
import { Config } from './Config';

export class ConfigUtil {

    public static load(): Config {

        if (fs.existsSync(process.env.SPOTIFY_CONFIG_PATH)) {

            return require(process.env.SPOTIFY_CONFIG_PATH);

        }

    }

    public static save(config: Config): void {

        fs.writeFileSync(process.env.SPOTIFY_CONFIG_PATH, JSON.stringify(config));

    }

    public static update(propertyName: string, value: any): Config {

        const config = ConfigUtil.load() || new Config();

        if (propertyName === 'token') {

            config.token = value;

        } else if (propertyName === 'expires') {

            config.expires = value;

        }

        ConfigUtil.save(config);

        return config;

    }

}
