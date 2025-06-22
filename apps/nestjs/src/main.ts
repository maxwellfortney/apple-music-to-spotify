// !! MAKE SURE THIS IS THE FIRST LINE OF THE FILE !!
import "dotenv/config";

import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { env } from "@workspace/env/nestjs";
import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        bodyParser: false,
    });
    app.set("query parser", "extended");

    app.enableCors({
        origin: env.TRUSTED_ORIGINS,
        credentials: true,
    });

    app.setGlobalPrefix("api", { exclude: ["/api/auth/{*path}"] });

    await app.listen(env.PORT);
}
bootstrap();
