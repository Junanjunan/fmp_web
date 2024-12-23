import { NextResponse } from "next/server";
import { spawn } from "child_process";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { params: { filePath, method, symbols}} = body;
    const symbolsString = JSON.stringify(symbols);
    const fmpProcess = new Promise((resolve, reject) => {
      const childProcess = spawn(
        'bash',
        [
          '-c',
          `source venv/bin/activate \
            && python -m ${filePath} ${method} '${symbolsString}'`,
        ], 
        {
          cwd: process.env.FMP_ROOT,
          detached: true, // Make the process independent
          stdio: ['ignore', 'pipe', 'pipe'] // Prevent the parent process from blocking the child
        },
      );

      // Unref the child process from the parent
      childProcess.unref();

      let dataString = '';
      let errorString = '';

      childProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      childProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      childProcess.on('close', (code) => {
        if (code !== 0) {
          reject(new Error(errorString || `Process exited with code ${code}`));
        }
        resolve(dataString);
      });
    });

    const result = await fmpProcess;
    return NextResponse.json({ result });
  } catch (error) {
    console.error('FMP execution error:', error);
    return NextResponse.json({ error: 'FMP execution error' }, { status: 500 });
  }
}