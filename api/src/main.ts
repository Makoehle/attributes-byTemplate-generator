import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { GLOBAL_PREFIX, PORT } from "./constants";
import { Logger, ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ["error", "warn", "log", "debug", "verbose", "fatal"],
  });
  app.setGlobalPrefix(GLOBAL_PREFIX);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(PORT);
  Logger.log(
    `🚀 Application is running on: http://localhost:${PORT}/${GLOBAL_PREFIX}`,
  );
}
bootstrap();
