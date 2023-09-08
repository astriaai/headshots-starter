# Headshot AI Leap Starter App

[![Headshot AI Demo](./app/public/demo.png)](https://tryleap.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
![ESLint](https://img.shields.io/badge/code_style-ESLint-5ed9c7.svg)
[![Next.js](https://img.shields.io/badge/built_with-Next.js-0070f3)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue)](https://www.typescriptlang.org/)

Introducing Headshot AI: an open-source repo that generates Professional AI Headshots in minutes, built on [Leap AI](https://tryleap.ai/).

The repo comes with:

- Next.js app and landing page
- Supabase DB & Auth
- Leap AI model training
- Leap AI to generate headshots
- Resend to email user when headshots are ready

Just add Stripe and you have a Headshot AI SaaS in a box.

## Deploy your own Headshot AI

[![Deploy with Vercel](https://vercel.com/import/project?template=https://github.com/leap-api/headshots-starter.git)

## Getting Started

To create your own Headshot AI app, follow these steps:

1. Clone the repository:

```
git clone https://github.com/leap-ai/headshots-starter.git
```

2. Enter the `headshots-starter` directory:

```
cd headshots-starter
```

3. Install dependencies:

   For npm:

   ```
   npm install
   ```

   For yarn:

   ```
   yarn
   ```

4. Create a [new Supabase project](https://database.new)

   - Rename `.env.local.example` to `.env.local` and update the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)

5. Create a [Leap AI](https://tryleap.ai/) account

   In your `.env.local` file:

   - Fill in `your_api_key` with your [Leap API key](https://docs.tryleap.ai/authentication)
   - Fill in `your-hosted-url/leap/train-webhook` with https://{your-hosted-url}/leap/train-webhook
   - Fill in `your-hosted-url/leap/image-webhook` with https://{your-hosted-url}/leap/image-webhook
   - Fill in `your-webhook-secret` with

6. Create a [Resend](https://resend.com/) account

   - Fill in `your-resend-api-key` with your Resend API Key

7. Start the development server:

   For npm:

   ```
   npm run dev
   ```

   For yarn:

   ```
   yarn dev
   ```

8. Visit `http://localhost:3000` in your browser to see the running app.

## Additional Use-Cases

Headshot AI can be easily adapted to support many other use-cases including:

- AI Avatars
  - [Anime](https://blog.tryleap.ai/transforming-images-into-anime-with-leap-ai/)
  - [Portraits](https://blog.tryleap.ai/ai-time-machine-images-a-glimpse-into-the-future-with-leap-ai/)
  - [Story Illustrations](https://blog.tryleap.ai/novel-ai-image-generator-using-leap-ai-a-comprehensive-guide/)
- Product Shots
- Food Photography
- Icons
- [Style-Consistent Assets](https://blog.tryleap.ai/how-to-generate-style-consistent-assets-finetuning-on-leap/)

& more!

## Contributing

We welcome collaboration and appreciate your contribution to Headshot AI. If you have suggestions for improvement or significant changes in mind, feel free to open an issue!

## Resources and Support

- Discord Community: [Leap Discord](https://discord.gg/NCAKTUayPK)
- Help Email: help@tryleap.ai

## License

Headshot AI is released under the [MIT License](https://choosealicense.com/licenses/mit/).
