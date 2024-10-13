import React, { useState, useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { GoogleGenerativeAI } from "@google/generative-ai";
const API_KEY = "AIzaSyACOy0RiIrmcnRhhMfftgWUF1xhZM_EPG4";
const genAI = new GoogleGenerativeAI(API_KEY);

export default function GeminiResponse(props) {
	const [generatedText, setGeneratedText] = useState("");
	useEffect(() => {
		const fetchData = async () => {
			const model = genAI.getGenerativeModel({ model: "gemini-pro" });
			const prompt = props.prompt;
			const result = await model.generateContent(prompt);
			const response = result.response;
			const text = response.text();
			setGeneratedText(text);
            console.log(text);
		};
		fetchData();
	}, []);

	return (
		<>
		<Text>{generatedText}</Text>
		</>
	);
}

const styles = StyleSheet.create({
	response: {
		flexDirection: "column",
		gap: 8,
		backgroundColor: "#fafafa",
		marginBottom: 8,
		padding: 16,
		borderRadius: 16,
	},
	icon: {
		width: 28,
		height: 28,
	},
});