#!/bin/bash
# This script sets up the environment for the project

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
source venv/Scripts/activate

# Install dependencies from requirements.txt
pip3 install -r requirements.txt
