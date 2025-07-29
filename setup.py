# sentinelmesh/setup.py

from setuptools import setup, find_packages

setup(
    name="sentinelmesh",
    version="1.0.0",
    description="A real-time security and policy mesh for MCP-based AI agent communication",
    author="Rishit Goel",
    author_email="rishit@example.com",
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        "streamlit",
        "pandas",
        "pyyaml"
    ],
    entry_points={
        "console_scripts": [
            "sentinelmesh-cli=sentinelmesh.cli.sentinel_cli:main",
            "sentinelmesh-replay=sentinelmesh.tools.replay_log:main"
        ]
    },
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.7',
)
