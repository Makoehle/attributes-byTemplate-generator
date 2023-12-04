import { HttpModule, HttpService } from "@nestjs/axios";
import { Logger, Module, OnModuleInit } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { MIN_REQUESTS, RATE_LIMIT, RATE_LIMIT_REMAINING } from "./constants";

export const INJECT_PANTARIS = "PANTARIS_HTTP_SRV";

const API = "PANTARIS_API";
const API_ERR = `${API} missing in .env`;
const AUTH = "PANTARIS_AUTH";
const AUTH_ERR = `${AUTH} missing in .env`;

@Module({
  exports: [INJECT_PANTARIS],
  imports: [
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (c: ConfigService) => {
        const Authorization = c.get<string>(AUTH);
        if (!Authorization) {
          throw new Error(AUTH_ERR);
        }

        const envApiUrl = c.get<string>(API);
        if (!envApiUrl) {
          throw new Error(API_ERR);
        }

        let apiUrl = envApiUrl;
        if (!envApiUrl.endsWith("/")) {
          apiUrl = `${envApiUrl}/`;
        }

        const baseURL = `${apiUrl}`;
        return {
          baseURL,
          headers: {
            Authorization,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: INJECT_PANTARIS,
      useExisting: HttpService,
    },
  ],
})
export class PantarisApiModule extends HttpModule implements OnModuleInit {
  private readonly logger: Logger = new Logger(PantarisApiModule.name);

  constructor(private readonly srv: HttpService) {
    super();
  }

  onModuleInit() {
    const axios = this.srv.axiosRef;

    axios.interceptors.request.use(
      function (config: InternalAxiosRequestConfig) {
        return config;
      },
      function (error) {
        return Promise.reject(error);
      },
    );

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    axios.interceptors.response.use(
      async function (res: AxiosResponse) {
        if (RATE_LIMIT - res.headers[RATE_LIMIT_REMAINING] >= MIN_REQUESTS) {
          throw new Error(
            "Please wait 60 seconds and try again, Pantaris rate limit!",
          );
        }

        self.logger.debug({
          currentLimit: res.headers[RATE_LIMIT_REMAINING],
          path: res.request.path,
        });
        return res;
      },
      function (error) {
        self.logger.error(error);
      },
    );
  }
}
