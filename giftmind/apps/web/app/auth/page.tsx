"use client";

import { Button, Input } from "@giftmind/ui";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, Phone, ShieldCheck, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { useAuth } from "../../components/auth-provider";
import { apiFetch } from "../../lib/api";

type Mode = "login" | "register";
type Step = "form" | "otp";

function passwordChecks(password: string) {
  return [
    { label: "8-аас дээш тэмдэгт", ok: password.length >= 8 },
    { label: "Том үсэг", ok: /[A-Z]/.test(password) },
    { label: "Жижиг үсэг", ok: /[a-z]/.test(password) },
    { label: "Тоо", ok: /\d/.test(password) },
    { label: "Тусгай тэмдэгт", ok: /[^A-Za-z0-9]/.test(password) }
  ];
}


export default function AuthPage() {
  const { setUser } = useAuth();
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>("form");
  const [name, setName] = useState("");
  const [localPhone, setLocalPhone] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [otp, setOtp] = useState(Array.from({ length: 6 }, () => ""));
  const [seconds] = useState(60);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const checks = useMemo(() => passwordChecks(password), [password]);
  const strongPassword = checks.every((check) => check.ok);
  const passwordsMatch = password.length > 0 && password === repeatPassword;

  function resetFeedback() {
    setError("");
    setMessage("");
  }

  async function login() {
    resetFeedback();
    setLoading(true);
    try {
      const data = await apiFetch<{ user: Parameters<typeof setUser>[0]; session: { access_token: string } }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ phone: localPhone, password })
      });
      localStorage.setItem("luxentia_session", data.session.access_token);
      setUser(data.user);
      router.push("/profile");
    } catch {
      setError("Утас эсвэл нууц үг буруу байна");
    } finally {
      setLoading(false);
    }
  }

  async function startRegistration() {
    resetFeedback();

    if (!name.trim()) return setError("Нэрээ оруулна уу");
    if (!strongPassword) return setError("Нууц үг хангалттай хүчтэй биш байна");
    if (!passwordsMatch) return setError("Давтсан нууц үг таарахгүй байна");

    setLoading(true);
    try {
      await apiFetch<{ user: Parameters<typeof setUser>[0]; isNewUser: boolean }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, phone: localPhone, password })
      });
      setMode("login");
      setStep("form");
      setName("");
      setPassword("");
      setRepeatPassword("");
      setShowPassword(false);
      setShowRepeat(false);
      setMessage("Бүртгэл амжилттай үүслээ. Одоо утас, нууц үгээрээ нэвтэрнэ үү.");
    } catch {
      setError("Бүртгэл үүсгэж чадсангүй. Дугаар бүртгэлтэй эсэхийг шалгана уу.");
    } finally {
      setLoading(false);
    }
  }

  async function verifyRegistration(code = otp.join("")) {
    resetFeedback();
    if (code.length !== 6) return;

    setLoading(true);
    try {
      const data = await apiFetch<{ session: { access_token: string } }>("/api/auth/verify-registration", {
        method: "POST",
        body: JSON.stringify({ phone: localPhone, otp: code })
      });
      localStorage.setItem("luxentia_session", data.session.access_token);
      setMessage("Бүртгэл баталгаажлаа. Тавтай морил!");
    } catch {
      setError("OTP код буруу эсвэл хугацаа дууссан байна");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-[calc(100vh-4rem)] place-items-center bg-white px-4 py-10 text-zinc-950 dark:bg-[#0f0a03] dark:text-slate-50">
      <motion.section layout className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-xl shadow-zinc-900/5 dark:border-[#3a2a0c] dark:bg-[#1a1205] dark:shadow-amber-950/20">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-amber-400 via-yellow-300 to-amber-600 text-amber-950 shadow-sm shadow-amber-500/30">
            <ShieldCheck className="size-6" />
          </span>
          <div>
            <h1 className="text-2xl font-black">{mode === "login" ? "Нэвтрэх" : "Бүртгэл үүсгэх"}</h1>
            <p className="text-sm text-zinc-600 dark:text-slate-400">
              {mode === "login" ? "Утас болон нууц үгээрээ шууд орно." : "Мэдээллээ бөглөөд бүртгүүлнэ."}
            </p>
          </div>
        </div>

        {step === "form" ? (
          <>
            <div className="mt-7 grid grid-cols-2 rounded-xl bg-amber-100 p-1 dark:bg-[#241807]">
              {(["login", "register"] as const).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    resetFeedback();
                    setMode(item);
                  }}
                  className={
                    mode === item
                      ? "rounded-lg bg-white px-3 py-2 text-sm font-bold shadow-sm dark:bg-[#3a2a0c]"
                      : "rounded-lg px-3 py-2 text-sm font-bold text-zinc-500 dark:text-slate-400"
                  }
                >
                  {item === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
                </button>
              ))}
            </div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6 space-y-4">
              {mode === "register" ? (
                <label className="block">
                  <span className="text-sm font-semibold">Нэр</span>
                  <div className="relative mt-2">
                    <UserRound className="absolute left-3 top-3 size-5 text-zinc-400" />
                    <Input className="pl-10 dark:border-[#3a2a0c] dark:bg-[#241807]" value={name} onChange={(event) => setName(event.target.value)} placeholder="Таны нэр" />
                  </div>
                </label>
              ) : null}

              <label className="block">
                <span className="text-sm font-semibold">Утас</span>
                <div className="relative mt-2 flex items-center">
                  <Phone className="absolute left-3 top-3 size-5 text-zinc-400" />
                  <span className="absolute left-10 top-1/2 -translate-y-1/2 select-none text-sm font-semibold text-zinc-500 dark:text-slate-400">+976 </span>
                  <Input
                    className="pl-[5.5rem] dark:border-[#3a2a0c] dark:bg-[#241807]"
                    inputMode="numeric"
                    value={localPhone}
                    onChange={(event) => setLocalPhone(event.target.value.replace(/\D/g, "").slice(0, 8))}
                    placeholder=""
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-sm font-semibold">Нууц үг</span>
                <div className="relative mt-2">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
                  <Input className="pl-12 pr-12 dark:border-[#3a2a0c] dark:bg-[#241807]" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
                  <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-slate-300">
                    {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                  </button>
                </div>
              </label>

              {mode === "register" ? (
                <>
                  <label className="block">
                    <span className="text-sm font-semibold">Нууц үг давтах</span>
                    <div className="relative mt-2">
                      <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-zinc-400" />
                      <Input className="pl-12 pr-12 dark:border-[#3a2a0c] dark:bg-[#241807]" type={showRepeat ? "text" : "password"} value={repeatPassword} onChange={(event) => setRepeatPassword(event.target.value)} placeholder="••••••••" />
                      <button type="button" onClick={() => setShowRepeat((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-slate-300">
                        {showRepeat ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                      </button>
                    </div>
                  </label>

                  <div className="rounded-xl border border-zinc-200 bg-amber-50 p-3 dark:border-[#3a2a0c] dark:bg-[#241807]">
                    <div className="grid gap-2">
                      {checks.map((check) => (
                        <div key={check.label} className={check.ok ? "flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300" : "flex items-center gap-2 text-sm text-zinc-500 dark:text-slate-400"}>
                          <Check className="size-4" />
                          {check.label}
                        </div>
                      ))}
                      <div className={passwordsMatch ? "flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-300" : "flex items-center gap-2 text-sm text-zinc-500 dark:text-slate-400"}>
                        <Check className="size-4" />
                        Давтсан нууц үг таарсан
                      </div>
                    </div>
                  </div>
                </>
              ) : null}

              <Button className="w-full bg-amber-500 hover:bg-amber-600" onClick={mode === "login" ? login : startRegistration} disabled={loading}>
                {loading ? "Түр хүлээнэ үү..." : mode === "login" ? "Нэвтрэх" : "Бүртгүүлэх"}
              </Button>
            </motion.div>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="mt-8">
            <button className="mb-5 flex items-center gap-2 text-sm font-semibold" onClick={() => setStep("form")}>
              <ArrowLeft className="size-4" />
              Буцах
            </button>
            <p className="mb-4 text-sm text-zinc-600 dark:text-slate-400">+976{localPhone} дугаарт ирсэн 6 оронтой кодыг оруулна уу.</p>
            <div className="grid grid-cols-6 gap-2">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(node) => { refs.current[index] = node; }}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  className="aspect-square rounded-lg border border-zinc-200 bg-white text-center text-2xl font-black outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-500/10 dark:border-[#3a2a0c] dark:bg-[#241807]"
                  onChange={(event) => {
                    const next = [...otp];
                    next[index] = event.target.value.replace(/\D/g, "");
                    setOtp(next);
                    if (next[index] && index < 5) refs.current[index + 1]?.focus();
                    if (next.join("").length === 6) verifyRegistration(next.join(""));
                  }}
                />
              ))}
            </div>
            <p className="mt-4 text-center text-sm text-zinc-600 dark:text-slate-400">00:{String(seconds).padStart(2, "0")}</p>
            <Button className="mt-5 w-full bg-amber-500 hover:bg-amber-600" onClick={() => verifyRegistration()} disabled={loading || otp.join("").length !== 6}>
              Бүртгэл баталгаажуулах
            </Button>
          </motion.div>
        )}

        <AnimatePresence>
          {error ? (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-500/10 dark:text-red-200">
              {error}
            </motion.p>
          ) : null}
          {message ? (
            <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-5 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">
              {message}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </motion.section>
    </main>
  );
}
