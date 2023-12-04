import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigService } from "@nestjs/config";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (c: ConfigService) => {
        return {
          uri: c.get<string>("MONGO_URL"),
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
