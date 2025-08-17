'use client';
import NavBar from "@/components/NavBar"
import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";


export default function Setting() {
    const [botMessageHour, setBotMessageHour] = useState<number | undefined>(undefined);
    const [botMessageMinute, setBotMessageMinute] = useState<number | undefined>(undefined);
    useEffect(() => {
        function fetchSetting() {
            fetch(`${process.env.NEXT_PUBLIC_API_URL}setting`, {
                credentials: 'include',
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error('Failed to fetch settings');
                }
                return res.json();
            })
            .then(data => {
                console.log('Settings:', data);
                setBotMessageHour(data[0]?.botMessageHour);
                setBotMessageMinute(data[0]?.botMessageMinute);
            })
            .catch(error => {
                console.error('Error fetching settings:', error);
            });
        }
        fetchSetting();        
    }, []);     

    function updateSetting(botMessageHour: number, botMessageMinute: number) {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}setting`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                botMessageHour,
                botMessageMinute,
                monthlyReportHour: 0, // Assuming you want to set these to 0 for now
                monthlyReportMinute: 0, // Assuming you want to set these to 0 for
            }),
        })
        .then(res => {
            if (!res.ok) {
                throw new Error('Failed to update settings');
            }
            return res.json();
        })
        .then(data => {
            console.log('Settings updated:', data);
        })
        .catch(error => {
            console.error('Error updating settings:', error);
        });
    }

    const handleSave = () => {
        if (botMessageHour === undefined || botMessageMinute === undefined) {
            alert("Please set both hour and minute.");
            return;
        } else if (botMessageHour < 0 || botMessageHour > 23 || botMessageMinute < 0 || botMessageMinute > 59) {
            alert("Please set a valid time.");
            return;
        } else {
            updateSetting(botMessageHour, botMessageMinute);
            alert("Settings saved successfully!");
        }
    };
        
    
    return (
        <div className="min-h-screen bg-[#F1F7F8] flex flex-col">
            <NavBar/>
            <div className="container px-5 md:px-0 md:mx-auto py-10">
                <h1 className="text-2xl font-bold mb-4">Settings</h1>
                <div className="flex gap-4">
                    <Label htmlFor="time-picker" className="px-1">
                        Bot Message Time
                    </Label>
                    <div className="flex flex-row gap-3">
                        <Input
                            type="number"
                            id="hour-picker"
                            step="1"
                            min={0}
                            max={23}
                            value={botMessageHour ?? ""}
                            onChange={(e) => setBotMessageHour(Number(e.target.value))}
                            required
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        :
                        <Input
                            type="number"
                            id="minute-picker"
                            step="1"
                            min={0}
                            max={59}
                            value={botMessageMinute ?? ""}
                            onChange={(e) => setBotMessageMinute(Number(e.target.value))}
                            required
                            className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                        />
                        <Button
                         onClick={handleSave}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}