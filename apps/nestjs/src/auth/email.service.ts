import { Injectable, Logger } from "@nestjs/common";
import { env } from "@workspace/env/nestjs";
import Mailjet from "node-mailjet";

@Injectable()
export class EmailService {
    private readonly logger = new Logger(EmailService.name);
    private readonly mailjet: Mailjet;

    constructor() {
        this.mailjet = new Mailjet({
            apiKey: env.MJ_APIKEY_PUBLIC,
            apiSecret: env.MJ_APIKEY_PRIVATE,
        });
    }

    async sendVerificationOTP(email: string, otp: string): Promise<void> {
        const request = this.mailjet.post("send", { version: "v3.1" }).request({
            Messages: [
                {
                    From: {
                        Email: "no_reply@maxf.io",
                        Name: "Crossfade",
                    },
                    To: [
                        {
                            Email: email,
                            Name: email.split("@")[0], // Use email prefix as name
                        },
                    ],
                    TemplateID: 7085525,
                    TemplateLanguage: true,
                    Subject: "Crossfade login code",
                    Variables: {
                        otp_code: otp,
                    },
                },
            ],
        });

        try {
            const result = await request;
            console.log(result);
            this.logger.log(`Verification email sent successfully to ${email}`);
        } catch (err) {
            this.logger.error(`Failed to send verification email to ${email}:`, err);
            throw new Error("Failed to send verification email");
        }
    }
}
