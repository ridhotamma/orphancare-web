'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import BackgroundImage from '@/images/background-image-2.webp';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const subject = encodeURIComponent('Permintaan Reset Kata Sandi');
    const body = encodeURIComponent(`Yth. Admin PSAA,

Saya mengajukan permintaan reset kata sandi untuk akun saya.

Email/Nama Pengguna: ${email}

Pesan Tambahan:
${message}

Terima kasih atas bantuannya.

Hormat saya,
${email}`);

    window.location.href = `mailto:admin.psaa@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <div className='hidden lg:block lg:w-1/2 relative'>
        <Image
          src={BackgroundImage}
          alt='Latar belakang lupa kata sandi'
          layout='fill'
          objectFit='cover'
        />
      </div>

      <div className='w-full lg:w-1/2 flex items-center justify-center p-8'>
        <div className='w-full max-w-md'>
          <h2 className='text-3xl font-bold mb-6 text-primary text-center'>
            Lupa Kata Sandi
          </h2>
          <p className='text-muted-foreground mb-6 text-center'>
            Untuk mengatur ulang kata sandi, Anda harus mengirim permintaan ke
            psaa.admin@gmail.com
          </p>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='email'>Email atau Nama Pengguna Anda</Label>
              <Input
                type='text'
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='space-y-2'>
              <Label htmlFor='message'>Pesan</Label>
              <Textarea
                id='message'
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              />
            </div>
            <Button type='submit' className='w-full'>
              Kirim Email
            </Button>
          </form>
          <div className='mt-8 text-center'>
            <Link
              href='/auth/login'
              className='text-sm text-primary hover:text-secondary'
            >
              Ingat kata sandi? Masuk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPasswordPage;
