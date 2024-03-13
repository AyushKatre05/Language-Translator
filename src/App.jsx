import { useEffect, useState } from 'react';
import Options from './Options';
import { IoMdSwap } from "react-icons/io";
import { FaVolumeUp } from "react-icons/fa";
import { FaCopy } from "react-icons/fa6";
import { FaMicrophone } from "react-icons/fa6";

function App() {
    const [fromText, setFromText] = useState('');
    const [toText, setToText] = useState('');
    const [fromLanguage, setFromLanguage] = useState('en-GB');
    const [toLanguage, setToLanguage] = useState('hi-IN');
    const [languages, setLanguages] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLanguages(Options);
    }, []);

    const copyFrom = () => {
        navigator.clipboard.writeText(fromText).then(() => {
            const textarea = document.getElementById("from");
            textarea.select();
        });
    }

    const copyTo = () => {
        navigator.clipboard.writeText(toText).then(() => {
            const textarea = document.getElementById("to");
            textarea.select();
        });
    }

    const speak = (text, language) => {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        synth.speak(utterance);
    }

    const handleExchange = () => {
        let x = fromText;
        setFromText(toText);
        setToText(x);
        let y = fromLanguage;
        setFromLanguage(toLanguage);
        setToLanguage(y);
    };

    const Translate = () => {
        setLoading(true);
        fetch(`https://api.mymemory.translated.net/get?q=${fromText}&langpair=${fromLanguage}|${toLanguage}`)
        .then((res) => res.json())
        .then((data) => {
            setToText(data.responseData.translatedText);
            setLoading(false);
        });
    };

    const handleIconClick = (target, id) => {
        if (!fromText || !toText) return;

        if (id === 'from') {
            if (target.classList.contains('fa-copy')) {
                copyFrom();
            } else {
                speak(fromText, fromLanguage);
            }
        } else {
            if (target.classList.contains('fa-copy')) {
                copyTo();
            } else {
                speak(toText, toLanguage);
            }
        }
    };

    const handleSpeakToText = (id) => {
        const recognition = new window.webkitSpeechRecognition();
        recognition.lang = fromLanguage;
        recognition.onresult = function(event) {
            const spokenText = event.results[0][0].transcript;
            if (id === 'from') {
                setFromText(spokenText);
            } else {
                setToText(spokenText);
            }
        }
        recognition.start();
    }

    return (
        <div className='h-screen w-full bg-blue-400'>
            <h1 className='text-white text-4xl font-bold text-center p-5'>Language Translator</h1>
            <div className="w-full px-4 flex flex-col">
                <div className="relative">
                    <textarea className='w-full h-[25vh] mb-4 border border-blue-600 p-3' name="from" placeholder="Enter Text" id="from" value={fromText} onChange={(e) => setFromText(e.target.value)}></textarea>
                    <div className="flex items-center justify-center gap-4">
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => speak(fromText, fromLanguage)}><FaVolumeUp /></button>
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => copyFrom()}><FaCopy /></button>
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => handleSpeakToText('from')}><FaMicrophone /></button>
                        <select className="border border-blue-600 rounded" value={fromLanguage} onChange={(e) => setFromLanguage(e.target.value)}>
                        {Object.entries(languages).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    </div>
                </div>
                <div className="flex justify-between items-center m-5">
                    <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => handleExchange()}><IoMdSwap /></button>
                    <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => Translate()} disabled={loading}>{loading ? 'Translating...' : 'Translate'}</button>
                </div>
                <div className="relative">
                    <textarea className='w-full h-[25vh] mb-4 border border-blue-600 p-3' name="to" id="to" value={toText} readOnly></textarea>
                    <div className="flex items-center justify-center gap-4">
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => speak(toText, toLanguage)}><FaVolumeUp /></button>
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => copyTo()}><FaCopy /></button>
                        <button className="p-2 rounded-full bg-blue-600 text-white" onClick={() => handleSpeakToText('to')}><FaMicrophone /></button>
                        <select className="border border-blue-600 rounded" value={toLanguage} onChange={(e) => setToLanguage(e.target.value)}>
                        {Object.entries(languages).map(([code, name]) => (
                            <option key={code} value={code}>{name}</option>
                        ))}
                    </select>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default App;
