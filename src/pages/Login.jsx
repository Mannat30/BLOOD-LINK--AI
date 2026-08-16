import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authService } from '../services/apiService'
import { toast } from 'react-toastify'
import {
  HiHeart,
  HiMail,
  HiLockClosed,
  HiEye,
  HiEyeOff,
  HiShieldCheck,
  HiUserGroup
} from 'react-icons/hi'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await authService.login(formData)

      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data))

      toast.success('Login successful!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(
          error.response?.data?.message || 'Login failed'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className="min-h-screen bg-slate-50">

        {/* =========================
          MAIN LAYOUT
      ========================== */}

        <div className="grid min-h-screen lg:grid-cols-2">

          {/* =====================================
            LEFT BRANDING SECTION
        ====================================== */}

          <div className="relative hidden overflow-hidden bg-gradient-to-br from-red-600 via-red-600 to-rose-800 lg:flex">

            {/* Decorative circles */}

            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-white/5" />

            <div className="absolute -bottom-40 -right-20 h-[500px] w-[500px] rounded-full bg-white/5" />

            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5" />

            <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">

              {/* Logo */}

              <Link
                  to="/"
                  className="flex w-fit items-center gap-3"
              >

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-xl">
                  <HiHeart className="text-2xl text-red-600" />
                </div>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    BloodLink
                  </h1>

                  <p className="text-xs text-red-100">
                    Saving lives together
                  </p>
                </div>

              </Link>


              {/* Main message */}

              <div className="max-w-lg">

                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">

                  <HiShieldCheck className="text-lg text-red-100" />

                  <span className="text-xs font-semibold text-white">
                  Secure & trusted platform
                </span>

                </div>

                <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl">
                  One connection can
                  <span className="block text-red-100">
                  save a life.
                </span>
                </h2>

                <p className="mt-6 max-w-md text-sm leading-7 text-red-100 xl:text-base">
                  BloodLink connects donors, patients, hospitals
                  and blood banks to make blood donation faster,
                  simpler and more accessible.
                </p>


                {/* Small statistics */}

                <div className="mt-10 grid grid-cols-3 gap-4">

                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                    <HiHeart className="text-xl text-white" />

                    <p className="mt-3 text-2xl font-bold text-white">
                      24/7
                    </p>

                    <p className="mt-1 text-xs text-red-100">
                      Support
                    </p>

                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                    <HiUserGroup className="text-xl text-white" />

                    <p className="mt-3 text-2xl font-bold text-white">
                      4+
                    </p>

                    <p className="mt-1 text-xs text-red-100">
                      User roles
                    </p>

                  </div>


                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">

                    <HiShieldCheck className="text-xl text-white" />

                    <p className="mt-3 text-2xl font-bold text-white">
                      Secure
                    </p>

                    <p className="mt-1 text-xs text-red-100">
                      Platform
                    </p>

                  </div>

                </div>

              </div>


              {/* Footer */}

              <p className="text-xs text-red-100">
                © {new Date().getFullYear()} BloodLink. Every drop matters.
              </p>

            </div>

          </div>


          {/* =====================================
            RIGHT LOGIN SECTION
        ====================================== */}

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12">

            <div className="w-full max-w-md">

              {/* Mobile logo */}

              <div className="mb-10 flex justify-center lg:hidden">

                <Link
                    to="/"
                    className="flex items-center gap-3"
                >

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-600 shadow-lg shadow-red-600/20">
                    <HiHeart className="text-2xl text-white" />
                  </div>

                  <div>
                    <h1 className="text-lg font-bold text-slate-900">
                      BloodLink
                    </h1>

                    <p className="text-xs text-slate-400">
                      Saving lives together
                    </p>
                  </div>

                </Link>

              </div>


              {/* Heading */}

              <div className="mb-8">

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
                  <HiHeart className="text-2xl text-red-600" />
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Sign in to your BloodLink account and continue
                  making a difference.
                </p>

              </div>


              {/* Login Card */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-200/50 sm:p-8">

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                  {/* Email */}

                  <div>

                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>

                    <div className="relative">

                      <HiMail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                      <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      />

                    </div>

                  </div>


                  {/* Password */}

                  <div>

                    <div className="mb-2 flex items-center justify-between">

                      <label
                          htmlFor="password"
                          className="text-sm font-semibold text-slate-700"
                      >
                        Password
                      </label>

                      <button
                          type="button"
                          className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Forgot password?
                      </button>

                    </div>

                    <div className="relative">

                      <HiLockClosed className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

                      <input
                          id="password"
                          name="password"
                          type={showPassword ? 'text' : 'password'}
                          required
                          autoComplete="current-password"
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-red-500 focus:bg-white focus:ring-4 focus:ring-red-500/10"
                      />

                      <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                      >
                        {showPassword ? (
                            <HiEyeOff className="text-lg" />
                        ) : (
                            <HiEye className="text-lg" />
                        )}
                      </button>

                    </div>

                  </div>


                  {/* Remember / secure */}

                  <div className="flex items-center gap-2">

                    <div className="flex h-5 w-5 items-center justify-center rounded-md bg-green-50">
                      <HiShieldCheck className="text-sm text-green-600" />
                    </div>

                    <span className="text-xs text-slate-500">
                    Your connection is protected and secure
                  </span>

                  </div>


                  {/* Submit */}

                  <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-red-600/20 transition duration-200 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-red-600/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                  >

                    {loading ? (
                        <>
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                          Signing in...
                        </>
                    ) : (
                        <>
                          Sign in
                          <span className="text-lg">→</span>
                        </>
                    )}

                  </button>

                </form>


                {/* Register */}

                <div className="mt-7 border-t border-slate-100 pt-6 text-center">

                  <p className="text-sm text-slate-500">

                    Don't have an account?{' '}

                    <Link
                        to="/register"
                        className="font-semibold text-red-600 transition hover:text-red-700"
                    >
                      Create an account
                    </Link>

                  </p>

                </div>

              </div>


              {/* Bottom trust message */}

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">

                <HiShieldCheck className="text-green-500" />

                Secure authentication powered by BloodLink

              </div>

            </div>

          </div>

        </div>

      </div>
  )
}

export default Login