'use client';

import { Event } from '@/components/Hero/Event';
import { FeaturedChefs } from '@/components/Hero/FeaturedChefs';
import { Footer } from '@/components/Hero/Footer';
import HeroSection from '@/components/Hero/HeroSection';
import { Ready } from '@/components/Hero/Ready';


export default function Home() {
  return (
    <>
    <HeroSection/>  
    <FeaturedChefs/>
    <Event/>
    <Ready/>
    <Footer/>
    </>
  );
    
    
}
