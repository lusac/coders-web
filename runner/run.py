import argparse
from subprocess import call

parser = argparse.ArgumentParser()
parser.add_argument("code")
parser.add_argument("type")

runner = {
    'python': 'python',
    'ruby': 'ruby',
    'nodejs': 'node',
}

def run(code, t):
    call([runner[t], code])
    return "ok!"

if __name__ == "__main__":
    args = parser.parse_args()
    run(args.code, args.type)
