'use client'

import React, { useState } from 'react'
import { SignUp } from '@clerk/nextjs'
import { AuthBrandHeader } from '@/features/auth/components/auth-brand-header'
import { RoleSelectionGrid, AccountType } from '@/features/auth/components/role-selection-grid'
import { SignupForm } from '@/features/auth/components/signup-form'

const hasValidKey = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.startsWith('pk_') &&
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY.includes('placeholder')
)

export default function SignupPage() {
  const [step, setStep] = useState<'select-role' | 'register'>('select-role')
  const [selectedRole, setSelectedRole] = useState<AccountType>('student')

  const handleSelectRole = (role: AccountType) => {
    setSelectedRole(role)
    const effectiveRole = role === 'skipped' ? 'student' : role
    try {
      localStorage.setItem('qm_signup_role', effectiveRole)
      localStorage.setItem('qm_account_type_selected', role)
    } catch {}
    setStep('register')
  }

  const roleLabels: Record<AccountType, string> = {
    scholar: 'باحث ومحقق أكاديمي (Scholar)',
    patron: 'مؤسسة وقفية / راعٍ (Patron)',
    skipped: 'مستكشف زائر (تحديد الحساب لاحقاً)',
    student: 'طالب علم / مستكشف (Student)',
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6" dir="rtl">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <AuthBrandHeader mode="signup" />

        {step === 'select-role' && (
          <RoleSelectionGrid
            selectedRole={selectedRole}
            onSelectRole={handleSelectRole}
            onSkip={() => handleSelectRole('skipped')}
          />
        )}

        {step === 'register' && (
          <div className="space-y-5 animate-fade-in">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
              <div className="flex items-center gap-2">
                <span className="text-slate-500">نوع الحساب المحدد:</span>
                <strong className="text-teal-800 font-bold">{roleLabels[selectedRole]}</strong>
              </div>
              <button
                type="button"
                onClick={() => setStep('select-role')}
                className="text-teal-700 hover:text-teal-800 text-xs font-semibold hover:underline cursor-pointer"
              >
                تغيير النوع ←
              </button>
            </div>

            {hasValidKey ? (
              <div className="clerk-container">
                <SignUp routing="hash" fallbackRedirectUrl="/dashboard" />
              </div>
            ) : (
              <SignupForm onSuccess={(email) => { window.location.href = `/verify-email?email=${encodeURIComponent(email)}` }} />
            )}
          </div>
        )}
      </div>
    </main>
  )
}
