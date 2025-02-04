'use client'
import Image from 'next/image'
import React from 'react'
import { CardItem } from '../models/CardItem';


interface CardProps {
    title: string;
    description: string;
    url: string;
    ID: number;
    star: number;
    branch: string;
    onCardClick: (card: CardItem | undefined) => void;

}
const CardComponent: React.FC<CardProps> = ({ ID, title, description, url, star, branch, onCardClick }) => {
    const handleClick = (buttonName: string) => {
        const card = new CardItem();
        card.ID = ID;
        card.actionType = buttonName
        onCardClick(card);
    }
    console.log(url)
    return (
        <div className='m-auto p-10' key={ID}>
            <div
                className="card shadow-[0px_4px_16px_px_#367E08] h-[400px] w-[280px] group gap-[0.5em] rounded-[1.5em] relative flex justify-end flex-col p-[1.5em] z-[1] overflow-hidden"
            >
                <div className="absolute top-0 left-0 h-full w-full bg-gray-700">

                    <Image
                        src={url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCETMOgLPxsbBJzIRrKytIx1w6BqxzJfS_ZQ&s'} // Replace with your image path
                        layout="fill"
                        objectFit="cover"
                        alt="Card Image"
                        className="opacity-50"
                    />
                </div>

                <div
                    className="container text-white z-[2] relative font-nunito flex flex-col gap-[0.5em]"
                >
                    <div className="h-fit w-full">
                        <h1
                            className="card_heading text-[1.5em] tracking-[.2em]"
                        //           style="font-weight: 900;
                        // -webkit-text-fill-color: transparent;
                        // -webkit-text-stroke-width: 1px;
                        // text-shadow: 0 0 7px #fff;"
                        >
                            {title}
                        </h1>
                        <p
                            className="text-[1.2em]"
                        //           style="font-weight: 900;
                        // -webkit-text-fill-color: transparent;
                        // -webkit-text-stroke-width: 1px;
                        // text-shadow: 0 0 7px #fff;"
                        >
                            {branch}
                        </p>
                    </div>

                    <div className="flex justify-left items-center h-fit w-full gap-[1.5em]">
                        <div className="w-fit h-fit flex justify-left gap-[0.5em]">
                            {[...Array(5)].map((_, index) => (
                                <svg
                                    key={index}
                                    viewBox="0 0 576 512"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-[1em] w-[1em]"
                                    fill={index < star ? "white" : "gray"}
                                >
                                    <path
                                        d="M316.7 17.8l65.43 132.4l146.4 21.29c26.27 3.796 36.79 36.09 17.75 54.59l-105.9 102.1l25.05 145.5c4.508 26.31-23.23 45.9-46.49 33.7L288 439.6l-130.9 68.7C133.8 520.5 106.1 500.9 110.6 474.6l25.05-145.5L29.72 226.1c-19.03-18.5-8.516-50.79 17.75-54.59l146.4-21.29l65.43-132.4C271.1-6.083 305-5.786 316.7 17.8z"
                                    ></path>
                                </svg>
                            ))}
                        </div>

                        <div className="w-fit h-fit text-white font-nunito text-[1.2em] font-light">
                            <p>{star}/5 stars</p>
                        </div>
                    </div>

                    <div className="flex justify-center items-center h-fit w-fit gap-[0.5em]">
                        {/* Buy now  */}
                        <div
                            className="border-2 border-white items-center rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer"
                        >
                            <button title='Buy now' onClick={() => handleClick('Buy')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M6 5v1H4.667a1.75 1.75 0 0 0-1.743 1.598l-.826 9.5A1.75 1.75 0 0 0 3.84 19H16.16a1.75 1.75 0 0 0 1.743-1.902l-.826-9.5A1.75 1.75 0 0 0 15.333 6H14V5a4 4 0 0 0-8 0Zm4-2.5A2.5 2.5 0 0 0 7.5 5v1h5V5A2.5 2.5 0 0 0 10 2.5ZM7.5 10a2.5 2.5 0 0 0 5 0V8.75a.75.75 0 0 1 1.5 0V10a4 4 0 0 1-8 0V8.75a.75.75 0 0 1 1.5 0V10Z" clipRule="evenodd" />
                                </svg>

                            </button>
                        </div>
                        {/* Add cart  */}
                        <div
                            className="border-2 text-center  border-white rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer"
                        >
                            <button title='Add to cart' onClick={() => handleClick('Add')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 pt-1">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-11.25a.75.75 0 0 0-1.5 0v2.5h-2.5a.75.75 0 0 0 0 1.5h2.5v2.5a.75.75 0 0 0 1.5 0v-2.5h2.5a.75.75 0 0 0 0-1.5h-2.5v-2.5Z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                        {/* Favorite  */}
                        {/* <div
                            className="border-2 border-white rounded-[0.5em] text-white font-nunito text-[1em] font-normal px-[0.5em] py-[0.05em] hover:bg-white hover:text-[#222222] duration-300 cursor-pointer"
                        >
                            <button title='Favorite' name='Favorite' onClick={() => handleClick('Favorite')}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                                    <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                                </svg>

                            </button>
                        </div> */}
                    </div>
                </div>
                <p
                    className="font-nunito block text-white font-light relative h-[0em] group-hover:h-[7em] leading-[1.2em] duration-500 overflow-hidden"
                >
                    {description}
                </p>
            </div>
        </div>
    )
}

export default CardComponent