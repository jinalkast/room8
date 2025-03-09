# Setup (Python 3.9.12)

Create a virtual environment and launch it with

```
python -m venv venv
venv/scripts/activate
```
Optional: Configure your VSCode interpreter to `camera_software\venv\Scripts\python.exe` if VSCode didn't do it for you

Install the requirements from the requirements.txt 
```
pip install -r requirements.txt
```

If you're getting issues installing the requirements try the following:
1. Make sure to call your commands with `python -m pip ...` instead of just `pip ...`
2. Ensure pip is installed with `python -m ensurepip` & `python -m ensurepip --user`
3. If the `python -m ensurepip --user` failed, go to your pyvenv.cfg file in the venv folder and change `include-system-site-packages` to `true`
4. Reinstall pip and other installation dependencies with `python -m pip install --upgrade pip setuptools wheel` and `pip install cmake wheel setuptools`

Run the script with `py main.py`

