import os from 'os';

export function getRuntimeDetails() {
  return {
    runtime: `Node.js ${process.version}`,
    os: `${os.platform()} ${os.release()}`,
  };
}
