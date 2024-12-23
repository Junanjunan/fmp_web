import { NextResponse } from "next/server";
import { spawn } from "child_process";


export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { params = [] } = body;
    const paramsString = JSON.stringify(params);
    const fmpProcess = new Promise((resolve, reject) => {
      const childProcess = spawn(
        'bash',
        [
          '-c',
          `source venv/bin/activate \
           && python -m services.subprocess test '${paramsString}'`,
        ], 
        {
          cwd: process.env.FMP_ROOT,
        },
      );

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