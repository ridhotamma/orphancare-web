import { Loader2 } from 'lucide-react';
import Logo from '@/images/logo.png';
import Image from 'next/image';

const AppLoading = () => {
  <div className='h-screen w-full flex flex-col justify-center items-center gap-4'>
    <Image src={Logo} alt='annajah logo' width={60} height={60} />
    <div className='flex items-center gap-2'>
      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
      Please Wait...
    </div>
  </div>;
};

export default AppLoading;
