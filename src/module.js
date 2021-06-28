console.log('module')

async function start() {
  return await Promise.resolve('Its working')
}

start().then(console.log)
