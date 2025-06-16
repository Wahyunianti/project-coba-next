import React from 'react';
import { RiCloseCircleFill } from "react-icons/ri";

type ModalTambahProps = {
    show: boolean;
    onClose: () => void;
    children: React.ReactNode;
    judul?: string
};

const ModalTambah: React.FC<ModalTambahProps> = ({ show, onClose, children, judul = 'Tambah Data' }) => {
    return (
        <div
            className={`fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300 ${show ? 'opacity-100 visible' : 'opacity-0 invisible'
                }`}
        >
            <div className="fixed inset-0 bg-black opacity-30" onClick={onClose}></div>
            <div className=" p-6 py-15 w-full h-min max-w-lg z-30 relative">
                <RiCloseCircleFill onClick={onClose} className='w-8 h-8 absolute right-4 top-13 cursor-pointer' />
                <div className='w-full h-150 md:h-full pb-20 shadow-lg bg-white p-5 rounded-lg transition'>
                    <h2
                        className="text-lg font-bold mb-4">{judul}</h2>
                    <div className='block w-full h-full'>
                        <div className='overflow-y-scroll flex flex-col overflow-x-hidden h-full'>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalTambah;
