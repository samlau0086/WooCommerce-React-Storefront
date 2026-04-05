import React from 'react';
import { Link } from 'react-router-dom';

export const About: React.FC = () => {
  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase">About Us</h2>
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Crafting the future of commerce.
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            We believe in building fast, modern, and beautiful headless storefronts that provide the best shopping experience possible.
          </p>
        </div>

        <div className="mt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://picsum.photos/seed/about/800/600" 
                alt="Our team working" 
                className="rounded-lg shadow-lg object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight sm:text-3xl mb-6">
                Our Story
              </h3>
              <div className="prose prose-blue text-gray-500">
                <p>
                  Founded in 2023, WooStore started as an experiment to see how fast we could make a WooCommerce storefront using modern web technologies like React and Tailwind CSS.
                </p>
                <p>
                  Traditional monolithic e-commerce platforms often suffer from slow page loads and rigid front-end architectures. By decoupling the frontend from the backend, we empower brands to deliver lightning-fast, highly customized shopping experiences.
                </p>
                <p>
                  Today, we provide this template as a starting point for developers and merchants who want to take their online presence to the next level.
                </p>
              </div>
              <div className="mt-8">
                <Link 
                  to="/" 
                  className="inline-flex px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                >
                  Explore Our Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
