/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import { List } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';
import { button } from 'framer-motion/client';
const psSymbols = ["✕", "◯", "□", "△"];

const page = () => {
    const [sidebar, isSidebarOpen] = useState(false);
    const route = useRouter();
    const router = () => {
        route.push('/car')
    }

    const [positions, setPositions] = useState<{ top: string; left: string }[][]>(
        []
    );

    useEffect(() => {
        const generated = Array.from({ length: 50 }, () =>
            psSymbols.map(() => ({
                top: `${Math.random() * 60 + 10}%`,
                left: `${Math.random() * 60 + 10}%`,
            }))
        );
        setPositions(generated);
    }, []);
    return (
        <div className='bg-[#000]/50 w-full min-h-screen '>
            {/* 
            <div className='bg-amber-50 w-[20vw] h-[20vh] rounded-[50%] relative'>
            </div>
            <div className='flex flex-col  items-center absolute gap-3'>
            <div className='bg-emerald-950/30 w-[5vw] h-[5vh]  border-2 rounded-t-[100%] rounded-b-[50%]'>
            </div>
            
            <div className='flex gap-10'>
            <div className='bg-emerald-950/30 w-[5vw] h-[5vh]  border-2 rounded-t-[100%] rounded-b-[50%] rotate-[-90deg]'>
            </div>
            
            <div className='bg-emerald-950/30 w-[5vw] h-[5vh]  border-2 rounded-t-[100%] rounded-b-[50%] rotate-90'>
            </div>
            </div>
            
            <div className='bg-emerald-950/30 w-[5vw] h-[5vh]  border-2 rounded-t-[100%] rounded-b-[50%] rotate-180'>
            </div>
            </div> */}
            {sidebar && ((
                <div
                    className={`${sidebar ? 'transition-transform' : '-translate-y-full'} w-full bg-black h-[88vh] border-b absolute rounded-b-[150px]`}>
                    <div className=' h-full flex flex-col items-center justify-center'>
                        {positions[30] &&
                            psSymbols.map((symbol, i) => (
                                <motion.span
                                    key={i}
                                    className="absolute text-white/10 text-9xl font-bold select-none"
                                    style={positions[30][i]}
                                    animate={{
                                        y: [0, -10, 0],
                                        opacity: [0.3, 0.8, 0.3],
                                        rotate: [0, 15, 15, 0],
                                    }}
                                    transition={{
                                        duration: 5 + i,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                    }}
                                >
                                    {symbol}
                                </motion.span>
                            ))}

                        <h1 className='text-2xl text-white/80'> THE SHOW</h1>
                        <div className=' bg-transparent h-[70vh] w-[90%] overflow-scroll border-2 border-white overflow-x-hidden' style={{scrollbarWidth:'thin',stopColor:'ActiveCaption'}}>
                           
                         <div className='flex  gap-y-5 gap-x-5 flex-wrap justify-between p-5'>  
                        <button className='bg-white w-[30vw] h-[5vh] text-xl hover:bg-stone-700/40 hover:text-white hover:skew-x-6 hover:transition-all' style={{transitionDuration:'3s'}} onClick={router}>CAR</button>   
                          </div>
                        </div>

                    </div>

                </div>
            ))
            }

            <div className='flex justify-center items-center flex-col h-screen'>
                <h1 className='text-center underline ash'>ORdinary life of indian nomad
                    <br /> and his wonderful fate of luck and wisdom , by <span><a href="" rel=''  className='text-neutral-700/50 border-2 border-b-amber-50 font-mono'>&copy;akshay</a></span> </h1>
            </div>
            <button className='absolute bottom-11 left-14' onClick={() => isSidebarOpen(true)}>
                <List className='text-white' size={40} />
            </button>
        </div >
    )
}

export default page