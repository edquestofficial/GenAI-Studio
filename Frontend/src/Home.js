import React, { useState } from "react";
import Box from "./Box";

const Home = () => {
    const projectsData = [
        {
            name: "KnowledgeLens",
            src: "knowledge.png",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/johndoe"
        },
        {
            name: "VoiceBot",
            src: "voicebot.png",
            description: "Streamlining workflows with intelligent automation",
            url: "https://www.edquest.com/janesmith"
        },
        {
            name: "VoiceInsights",
            src: "voiceinsight.png",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/alexjohnson"
        },
        {
            name: "InvoiceParser",
            src: "invoice.png",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/emilybrown"
        },
        {
            name: "Eye-Glass Try on",
            src: "https://randomuser.me/api/portraits/men/5.jpg",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/michaellee"
        },
        {
            name: "Code Optimizer",
            src: "https://randomuser.me/api/portraits/women/6.jpg",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/sarakim"
        },
        {
            name: "AI Tutor",
            src: "https://randomuser.me/api/portraits/men/7.jpg",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/davidpatel"
        },
        {
            name: "Image Upscaler",
            src: "https://randomuser.me/api/portraits/women/8.jpg",
            description: "AI powered asssistant providing empathic support and guidance",
            url: "https://www.edquest.com/lindanguyen"
        }
    ];
    const [projects, setProjects] = useState(projectsData)

return (
    <>
    <div className="mb-15 text-left pt-4 ml-[66px]">
        <h3 className="text-2xl font-bold mb-2">GenAI Studio</h3>
        <p className="text-md text-gray-600">Showcasing Cutting-Edge AI Proof of Concepts</p>
    </div>
    <div className="flex flex-col h-screen gap-6 items-center">
        {Array.from({ length: Math.ceil(projects.length / 4) }).map((_, rowIdx) => (
            <div className="flex gap-6" key={rowIdx}>
                {projects.slice(rowIdx * 4, rowIdx * 4 + 4).map((project, idx) => (
                    <Box
                        key={rowIdx * 4 + idx}
                        name={project.name}
                        src={project.src}
                        description={project.description}
                        url={project.url}
                    />
                ))}
            </div>
        ))}
    </div>
    </>
);
};

export default Home;
