@echo off
title Chat Widget Backend - Dependency Installation
color 0A

echo.
echo ===============================================
echo   Chat Widget Backend - Dependency Installer
echo ===============================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python is not installed or not in PATH
    echo Please install Python 3.11+ and try again
    pause
    exit /b 1
)

echo ✅ Python found
python --version

REM Check if we're in a virtual environment
python -c "import sys; exit(0 if hasattr(sys, 'real_prefix') or (hasattr(sys, 'base_prefix') and sys.base_prefix != sys.prefix) else 1)" >nul 2>&1
if errorlevel 1 (
    echo.
    echo ⚠️  Warning: No virtual environment detected
    echo It's recommended to use a virtual environment
    echo.
    set /p continue="Continue anyway? (y/n): "
    if /i not "%continue%"=="y" (
        echo Installation cancelled
        pause
        exit /b 1
    )
) else (
    echo ✅ Virtual environment detected
)

echo.
echo ⬆️ Upgrading pip and setuptools...
python -m pip install --upgrade pip setuptools wheel
if errorlevel 1 (
    echo ❌ Failed to upgrade pip
    pause
    exit /b 1
)

echo.
echo 🤖 Installing PyTorch (CPU version)...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
if errorlevel 1 (
    echo ❌ Failed to install PyTorch
    pause
    exit /b 1
)

echo.
echo 📦 Installing other dependencies from requirements.txt...
if not exist requirements.txt (
    echo ❌ requirements.txt not found in current directory
    echo Please make sure you're running this from the backend folder
    pause
    exit /b 1
)

pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install some dependencies
    echo Check the error messages above
    pause
    exit /b 1
)

echo.
echo ✅ Verifying installation...
python -c "
import sys
packages_to_test = [
    ('torch', 'PyTorch'),
    ('sentence_transformers', 'Sentence Transformers'),
    ('pinecone', 'Pinecone'),
    ('fastapi', 'FastAPI'),
    ('sqlalchemy', 'SQLAlchemy'),
    ('redis', 'Redis'),
    ('aiohttp', 'aiohttp'),
    ('pydantic', 'Pydantic'),
    ('uvicorn', 'Uvicorn')
]

print('Testing package imports...')
failed = []
for pkg, name in packages_to_test:
    try:
        __import__(pkg)
        print(f'✅ {name}')
    except ImportError as e:
        print(f'❌ {name}: {e}')
        failed.append(name)

if failed:
    print(f'\n🚨 Failed imports: {failed}')
    print('Some packages failed to install properly.')
    sys.exit(1)
else:
    print('\n🎉 All packages installed successfully!')
    
# Show PyTorch info
import torch
print(f'\n📊 PyTorch version: {torch.__version__}')
print(f'📊 CUDA available: {torch.cuda.is_available()}')
print(f'📊 CPU cores: {torch.get_num_threads()}')
"

if errorlevel 1 (
    echo.
    echo ❌ Some packages failed verification
    echo Please check the error messages above
    pause
    exit /b 1
)

echo.
echo ===============================================
echo   ✨ Installation Complete! ✨
echo ===============================================
echo.
echo 📋 Next steps:
echo 1. Set up your .env file with API keys
echo 2. Create Pinecone index manually
echo 3. Set up PostgreSQL database
echo 4. Set up Redis server
echo 5. Run: python setup_database.py
echo 6. Start server: uvicorn app.main:app --reload
echo.
echo Press any key to exit...
pause >nul