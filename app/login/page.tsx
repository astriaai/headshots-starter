import Messages from './messages'
import { Label } from '@/components/ui/label'

export default async function Login() {
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form
        className="flex-1 flex flex-col w-full justify-center gap-2 text-white"
        action="/auth/sign-in"
        method="post"
      >
        <Label className="text-md" htmlFor="email">
          Email
        </Label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-slate-700"
          name="email"
          placeholder="you@example.com"
          required
        />
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6 bg-slate-700"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <button className="bg-green-700 rounded px-4 py-2 mb-2">
          Sign In
        </button>
        <button
          formAction="/auth/sign-up"
          className="border border-gray-700 rounded px-4 py-2 mb-2"
        >
          Sign Up
        </button>
        <Messages />
      </form>
    </div>
  )
}
