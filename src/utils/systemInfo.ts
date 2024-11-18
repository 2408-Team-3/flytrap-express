import os from 'os';

export function getSystemDetails() {
  return {
    runtime: `Node.js ${process.version}`,
    os: `${os.platform()} ${os.release()}`,
  };
}
