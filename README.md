# 👨‍💼 [Headshot AI](https://headshots-starter.vercel.app/) - Professional Headshots with AI

Introducing Headshot AI, an open-source project from [Leap AI](https://tryleap.ai/) that generates Professional AI Headshots in minutes.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/leap-ai/headshots-starter.git)

[![Headshot AI Demo](/public/demo.png)](https://headshots-starter.vercel.app/)

## How It Works

The app is powered by:

- 🚀 [Leap AI](https://tryleap.ai/) for AI model training
- 🚀 [Leap AI](https://tryleap.ai/) to generate headshots
- ▲ [Next.js](https://nextjs.org/) for app and landing page
- 🔋 [Supabase](https://supabase.com/) for DB & Auth
- 📩 [Resend](https://resend.com/) (optional) to email user when headshots are ready
- ⭐️ [Shadcn](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/) for styles
- 🔥 [Replit](https://replit.com/@leap-ai/Headshot-AI-Professional-Headshots-with-Leap-AI) for 1-click app run in the browser
- 💳 [Stripe](https://stripe.com/) for billing (optional)

Just add Stripe and you have a Headshot AI SaaS in a box.

[![Headshot AI Explainer](/public/explainer.png)](https://tryleap.ai/)

## Running Locally

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

   ```bash
   npm install
   ```

   For yarn:

   ```bash
   yarn
   ```

4. Create a [new Supabase project](https://database.new) and create the tables required for the app:

   - Rename `.env.local.example` to `.env.local` and update the values for `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` from [your Supabase project's API settings](https://app.supabase.com/project/_/settings/api)


   **Make sure to configure your row level permissions on your tables, in the supabase dashboard**
   You can find out how to set them up [Here](/public/Supabase-policies/);

   ![Visualized Schemas](https://headshots-starter.vercel.app/visualized_schemas.png)

   This code block defines the schema for three tables: `images`, `models`, and `samples`.

   For any table column with `foreign_key`, make sure to link it while creating the column in Supabase.

   [images]

   - id (int8)
   - modelId (int8) (foreign_key)\*
   - uri (text)
   - created_at (timestamptz)

   [models] - (Make sure to enable realtime on this table)

   - id (int8)
   - name (text)
   - type (text)
   - created_at (timestamptz)
   - user_id (uuid) (foreign_key)\*
   - status (text)
   - modelId (text)

   [samples]

   - id (int8)
   - uri (text)
   - modelId (int8) (foreign_key)\*

   [credits]

   - id (int8)
   - created_at (timestamptz)
   - credits (int4)
   - user_id (uuid) (foreign_key)\*

6.  Magic Link Auth (Supabase)

   In your supabase [dashboard](https://supabase.com/dashboard/project/{projectId}/auth/templates), make sure to update the email template for magic link correctly. You can use the following template:

   Make sure to setup your site URL and redirect urls in the supabase dashboard under Authentication -> URL Configuration.
   For example:
   Site URL: https://headshots-starter.vercel.app
   Redirect URL: https://headshots-starter.vercel.app/**

   ```
   <h2>Magic Link</h2>
   <p>Follow this link to login:</p>
   <p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Log In</a></p>
   ```

5. Create a [Leap AI](https://tryleap.ai/) account

   In your `.env.local` file:

   - Fill in `your_api_key` with your [Leap API key](https://docs.tryleap.ai/authentication)
   - Fill in `your-hosted-url/leap/train-webhook` with https://{your-hosted-url}/leap/train-webhook
   - Fill in `your-hosted-url/leap/image-webhook` with https://{your-hosted-url}/leap/image-webhook
   - Fill in `your-webhook-secret` with any arbitrary URL friendly string eg.`shadf892yr398hq23h`

6. Create a [Resend](https://resend.com/) account (Optional)

   - Fill in `your-resend-api-key` with your Resend API Key if you wish to use Resend to email users when their model has finished training.

7. Configure [Stripe](https://stripe.com) to bill users on a credit basis. (Optional)

   The current setup is for a credit based system. 1 credit = 1 model train.

   To enable Stripe billing, you will need to fill out the following fields in your `.env.local` file:
   - STRIPE_SECRET_KEY=your-stripe-secret-key
   - STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
   - STRIPE_PRICE_ID_ONE_CREDIT=your-stripe-price-id-one-credit
   - STRIPE_PRICE_ID_THREE_CREDIT=your-stripe-price-id-three-credit
   - STRIPE_PRICE_ID_FIVE_CREDIT=your-stripe-price-id-five-credit
   - NEXT_PUBLIC_STRIPE_IS_ENABLED=false # set to true to enable Stripe payments

   You need to do multiple things to get Stripe working:
   - Get your Stripe API secret key from the [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
   - Create a [Stripe Webhook](https://dashboard.stripe.com/test/webhooks) that will point to your hosted URL. The webhook should be listening for the `checkout.session.completed` event. The webhook should point to `your-hosted-url/stripe/subscription-webhook`.
   - Create a [Stripe Price](https://dashboard.stripe.com/test/products) for each credit package you want to offer.
   - Create a [Stripe Pricing Table](https://dashboard.stripe.com/test/pricing-tables) and replace the script @/components/stripe/StripeTable.tsx with your own values. It should look like this:

   ```js
   <stripe-pricing-table 
      pricing-table-id="your-stripe-pricing-table-id" 
      publishable-key="your-stripe-publishable-key" 
      client-reference-id={user.id}
      customer-email={user.email}
      >
   </stripe-pricing-table>
   ```

   Here are the products you need to create to get Stripe working with our example, checkout the images [Here](/public/Stripe/)

   To create them go on the Stripe dashboard, search for Product Catalog and then click on the add product button on the top right of the screen. You will need to create 3 products, one for each credit package as shown in the images before. We set them to One time payments, but you can change that if you want to and you can set the price too. After creating the products make sure to update the variables in the .env.local [your-stripe-price-id-one-credit, your-stripe-price-id-three-credit, your-stripe-price-id-five-credit] with their respective price ids, each price id is found in the product page at the bottom.

7. Start the development server:

   For npm:

   ```bash
   npm run dev
   ```

   For yarn:

   ```bash
   yarn dev
   ```

8. Visit `http://localhost:3000` in your browser to see the running app.

## One-Click Deploy

Deploy the example using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/project?template=https://github.com/leap-ai/headshots-starter.git)

Or fork the repo and Deploy using [Replit](https://replit.com/@leap-ai/Headshot-AI-Professional-Headshots-with-Leap-AI).

## How To Get Good Results

[![Good results Demo](/public/good_results.png)](https://blog.tryleap.ai/create-an-ai-headshot-generator-fine-tune-stable-diffusion-with-leap-api/#step-1-gather-your-image-samples-%F0%9F%93%B8)

The image samples used to teach the model what your face looks like are critical. Garbage in = garbage out.

- Enforce close-ups of faces and consider cropping so that the face is centered.
- Enforce images with only one person in the frame.
- Avoid accessories in samples like sunglasses and hats.
- Ensure the face is clearly visible. (For face detection, consider using tools like [Cloudinary API](https://cloudinary.com/documentation/face_detection_based_transformations?ref=blog.tryleap.ai)).

[![Avoid multiple faces](/public/multiple_faces.png)](https://blog.tryleap.ai/create-an-ai-headshot-generator-fine-tune-stable-diffusion-with-leap-api/#how-to-avoid-multiple-faces-in-results-%E2%9D%8C)

If you get distorted results with multiple faces, repeated subjects, multiple limbs, etc, make sure to follow these steps and minimize the chance of this happening:

- Make sure any samples uploaded are the same 1:1 height / width aspect ratio, for example 512x512, 1024x1024, etc.
- Avoid multiple people in the samples uploaded.
- Add "double torso, totem pole" to the negative prompt when generating.
- Make sure your dimensions when generating are also 1:1 with the same height / width ratios of the samples.

For more information on how to improve quality, read the blog [here](https://blog.tryleap.ai/create-an-ai-headshot-generator-fine-tune-stable-diffusion-with-leap-api/#step-1-gather-your-image-samples-%F0%9F%93%B8).

## Additional Use-Cases

Headshot AI can be easily adapted to support many other use-cases on [Leap AI](https://tryleap.ai/) including:

- AI Avatars
  - [Anime](https://blog.tryleap.ai/transforming-images-into-anime-with-leap-ai/)
  - [Portraits](https://blog.tryleap.ai/ai-time-machine-images-a-glimpse-into-the-future-with-leap-ai/)
  - [Story Illustrations](https://blog.tryleap.ai/novel-ai-image-generator-using-leap-ai-a-comprehensive-guide/)

[![Anime AI Demo](/public/anime.png)](https://tryleap.ai/)

- Pet Portraits

[![Pet AI Demo](/public/pet.png)](https://tryleap.ai/)

- Product Shots
- Food Photography

[![Product AI Demo](/public/products.png)](https://tryleap.ai/)

- Icons
- [Style-Consistent Assets](https://blog.tryleap.ai/how-to-generate-style-consistent-assets-finetuning-on-leap/)

[![Icons AI Demo](/public/icons.png)](https://tryleap.ai/)

& more!

## Contributing

We welcome collaboration and appreciate your contribution to Headshot AI. If you have suggestions for improvement or significant changes in mind, feel free to open an issue!

If you want to contribute to the codebase make sure you create a new branch and open a pull request that points to `dev`.

## Resources and Support

- Discord Community: [Leap Discord](https://discord.gg/NCAKTUayPK)
- Help Email: help@tryleap.ai

## License

Headshot AI is released under the [MIT License](https://choosealicense.com/licenses/mit/).
