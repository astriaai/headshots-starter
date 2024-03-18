# 👨‍💼 [Headshot AI](https://headshots-starter.vercel.app/) - Professional Headshots with AI

Introducing Headshot AI, an open-source project from [Leap AI](https://tryleap.ai/) that generates Professional AI Headshots in minutes.

This project was built to give developers & makers a great starting point into building AI applications. This is your launch pad - fork the code, modify it, and make it your own to build a popular AI SaaS app.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain&env=LEAP_API_KEY,LEAP_WEBHOOK_SECRET,LEAP_WORKFLOW_ID&envDescription=Set%20up%20environment%20variables%20for%20Leap%20AI%20and%20redirect%20URL%20in%20Supabase%20Auth%20dashboard.%20See%20.env.local.example%20for%20full%20config%20with%20Resend%20and%20Stripe.&envLink=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Fblob%2Fmain%2F.env.local.example&project-name=headshots-starter-clone&repository-name=headshots-starter-clone&demo-title=AI%20Headshot%20Generator&demo-description=A%20Professional%20AI%20headshot%20generator%20starter%20kit%20powered%20by%20Next.js%2C%20Leap%20AI%2C%20and%20Vercel&demo-url=https%3A%2F%2Fwww.getheadshots.ai%2F&demo-image=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1CEDfTwO5vPEiNMgN2Y1t6%2F245d1e0c11c4d8e734fbe345b9ecdc7c%2Fdemo.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain)

[![Headshot AI Demo](/public/demo.png)](https://headshots-starter.vercel.app/)

## Video tutorial

Click **[here](http://www.youtube.com/watch?v=vV5Ig8uZmZI)** to watch the full tutorial 👇

[![Watch the video](/public/video_tutorial.png)](http://www.youtube.com/watch?v=vV5Ig8uZmZI)

## How It Works

Live demo **[here](https://getheadshots.ai)**.

The app is powered by:

- 🚀 [Leap AI](https://tryleap.ai/) for AI model training & inference
- ▲ [Next.js](https://nextjs.org/) for app and landing page
- 🔋 [Supabase](https://supabase.com/) for DB & Auth
- 📩 [Resend](https://resend.com/) (optional) to email user when headshots are ready
- ⭐️ [Shadcn](https://ui.shadcn.com/) with [Tailwind CSS](https://tailwindcss.com/) for styles
- ▲ [Vercel](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain&env=LEAP_API_KEY,LEAP_WEBHOOK_SECRET,LEAP_WORKFLOW_ID&envDescription=Set%20up%20environment%20variables%20for%20Leap%20AI%20and%20redirect%20URL%20in%20Supabase%20Auth%20dashboard.%20See%20.env.local.example%20for%20full%20config%20with%20Resend%20and%20Stripe.&envLink=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Fblob%2Fmain%2F.env.local.example&project-name=headshots-starter-clone&repository-name=headshots-starter-clone&demo-title=AI%20Headshot%20Generator&demo-description=A%20Professional%20AI%20headshot%20generator%20starter%20kit%20powered%20by%20Next.js%2C%20Leap%20AI%2C%20and%20Vercel&demo-url=https%3A%2F%2Fwww.getheadshots.ai%2F&demo-image=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1CEDfTwO5vPEiNMgN2Y1t6%2F245d1e0c11c4d8e734fbe345b9ecdc7c%2Fdemo.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain) for deployments
- 💳 [Stripe](https://stripe.com/) for billing

[![Headshot AI Explainer](/public/explainer.png)](https://tryleap.ai/)

## Running Locally

To create your own Headshot AI app, follow these steps:

> **Note**<br/>Training models is only available on paid plans. You'll need an active [Leap AI plan](<[url](https://tryleap.ai/pricing)>) to train models.

### 1. Vercel template

To setup Supabase/Vercel and your github repo, click on the Vercel Deploy Button and follow the steps.

IMPORTANT: In the Supabase integration step: Make sure you leave the Create sample tables option checked. This might take a few minutes to complete.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain&env=LEAP_API_KEY,LEAP_WEBHOOK_SECRET,LEAP_WORKFLOW_ID&envDescription=Set%20up%20environment%20variables%20for%20Leap%20AI%20and%20redirect%20URL%20in%20Supabase%20Auth%20dashboard.%20See%20.env.local.example%20for%20full%20config%20with%20Resend%20and%20Stripe.&envLink=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Fblob%2Fmain%2F.env.local.example&project-name=headshots-starter-clone&repository-name=headshots-starter-clone&demo-title=AI%20Headshot%20Generator&demo-description=A%20Professional%20AI%20headshot%20generator%20starter%20kit%20powered%20by%20Next.js%2C%20Leap%20AI%2C%20and%20Vercel&demo-url=https%3A%2F%2Fwww.getheadshots.ai%2F&demo-image=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1CEDfTwO5vPEiNMgN2Y1t6%2F245d1e0c11c4d8e734fbe345b9ecdc7c%2Fdemo.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain)

The Vercel Deployment will create a new repository with this template on your GitHub account and guide you through a new Supabase project creation. The Supabase Vercel Deploy Integration will set up the necessary Supabase environment variables and run the SQL migrations to set up the Database schema on your account. You can inspect the created tables in your project's Table editor.

This will create the tables with their respective columns and RLS policies:

- credits
- images
- models
- samples

### 2. Clone your newly created repo:

```
git clone {{your-repo-name}}
```

### 3. Enter your newly created repo's directory:

```
cd {{your-repo-name}}
```

### 4. Install dependencies:

For npm:

```bash
npm install
```

For yarn:

```bash
yarn
```

### 5. Magic Link Auth (Supabase)

In your supabase [dashboard](https://supabase.com/dashboard/), select newly created project, go to Authentication -> Email Templates -> Magic Link and paste the following template:

```
<h2>Magic Link</h2>
<p>Follow this link to login:</p>
<p><a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email">Log In</a></p>
```

Then, make sure to setup your site URL and redirect urls in the supabase dashboard under Authentication -> URL Configuration.

For example:

Site URL: https://headshots-starter.vercel.app

Redirect URL: https://headshots-starter.vercel.app/**

### 6. Create a [Leap AI](https://tryleap.ai/) account

In your Leap Workflows dashboard, clone the `Headshot Generator` template, then publish the workflow.

In your `.env.local` file:

- Fill in `your_api_key` with your [Leap API key](https://alpha.tryleap.ai)
- Fill in `your-workflow-id` with your [Leap workflowId](https://alpha.tryleap.ai) after publishing your Headshot Generator template.
- Fill in `your-webhook-secret` with any arbitrary URL friendly string eg.`shadf892yr398hq23h`
- Fill in `your-vercel-url` with a url to catch webhooks from Leap. This will be your vercel deployment url or Ngrok tunnel locally (eg. https://{your-hosted-url}/leap/train-webhook)
- Fill in `your-blob-read-write-token` with your Vercel Blob token (steps below)

### 7. Configure [Vercel Blob](https://vercel.com/docs/storage/vercel-blob/quickstart#client-uploads) for image uploads

In your Vercel project, create a [Blob store](https://vercel.com/docs/storage/vercel-blob/quickstart#create-a-blob-store)

- In your Vercel dashboard, select the Storage tab, then select the Connect Database button.
- Under the Create New tab, select Blob and then the Continue button.

Then to configure in your .env:

- In your Vercel dashboard, select the Settings tab, then select the Environment Variables tab.
- Copy your `BLOB_READ_WRITE_TOKEN` to your .env

### 8. Create a [Resend](https://resend.com/) account (Optional)

- Fill in `your-resend-api-key` with your Resend API Key if you wish to use Resend to email users when their model has finished training.

### 9. Configure [Stripe](https://stripe.com) to bill users on a credit basis. (Optional)

The current setup is for a credit based system. 1 credit = 1 model train.

To enable Stripe billing, you will need to fill out the following fields in your `.env.local` file:

- STRIPE_SECRET_KEY=your-stripe-secret-key
- STRIPE_WEBHOOK_SECRET=your-stripe-webhook-secret
- STRIPE_PRICE_ID_ONE_CREDIT=your-stripe-price-id-one-credit
- STRIPE_PRICE_ID_THREE_CREDITS=your-stripe-price-id-three-credit
- STRIPE_PRICE_ID_FIVE_CREDITS=your-stripe-price-id-five-credit
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
></stripe-pricing-table>
```

Here are the products you need to create to get Stripe working with our example, checkout the images [Here](/public/Stripe/)

To create them go on the Stripe dashboard, search for Product Catalog and then click on the add product button on the top right of the screen. You will need to create 3 products, one for each credit package as shown in the images before. We set them to One time payments, but you can change that if you want to and you can set the price too. After creating the products make sure to update the variables in the .env.local [your-stripe-price-id-one-credit, your-stripe-price-id-three-credit, your-stripe-price-id-five-credit] with their respective price ids, each price id is found in the product page at the bottom.

### 10. Start the development server:

For npm:

```bash
npm run dev
```

For yarn:

```bash
yarn dev
```

### 11. Visit `http://localhost:3000` in your browser to see the running app.

## One-Click Deploy

Default deploy using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain&env=LEAP_API_KEY,LEAP_WEBHOOK_SECRET,LEAP_WORKFLOW_ID&envDescription=Set%20up%20environment%20variables%20for%20Leap%20AI%20and%20redirect%20URL%20in%20Supabase%20Auth%20dashboard.%20See%20.env.local.example%20for%20full%20config%20with%20Resend%20and%20Stripe.&envLink=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Fblob%2Fmain%2F.env.local.example&project-name=headshots-starter-clone&repository-name=headshots-starter-clone&demo-title=AI%20Headshot%20Generator&demo-description=A%20Professional%20AI%20headshot%20generator%20starter%20kit%20powered%20by%20Next.js%2C%20Leap%20AI%2C%20and%20Vercel&demo-url=https%3A%2F%2Fwww.getheadshots.ai%2F&demo-image=https%3A%2F%2Fimages.ctfassets.net%2Fe5382hct74si%2F1CEDfTwO5vPEiNMgN2Y1t6%2F245d1e0c11c4d8e734fbe345b9ecdc7c%2Fdemo.png&integration-ids=oac_VqOgBHqhEoFTPzGkPd7L0iH6&external-id=https%3A%2F%2Fgithub.com%2Fleap-ai%2Fheadshots-starter%2Ftree%2Fmain)

Deployment also supported on [Replit](https://replit.com/@leap-ai/Headshot-AI-Professional-Headshots-with-Leap-AI).

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

### All Thanks To Our Contributors :

<a href="https://github.com/leap-ai/headshots-starter/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=leap-ai/headshots-starter" />
</a>

## Additional Use-Cases

Headshot AI can be easily adapted to support many other use-cases of [Leap AI](https://tryleap.ai/) including:

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
