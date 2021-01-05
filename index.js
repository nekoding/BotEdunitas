const express = require('express')
const { Telegraf } = require('telegraf')
const axios = require('axios')
const currencyFormatter = require('currency-formatter');

const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome to EdunitasBot'))
bot.command('checktagihan', (ctx) => {
  getData()
  .then(response => response.data)
  .then(data => {
    if (data.length > 0 ) {
      const {nama, label, tanggal, email, telepon, whatsapp, nosel, kampus, prodi, kelas, novirtual, nominal} = data[0]

      let template = `*${label} - ${tanggal}*\n*Nama : *\`${nama}\`\n*Email : *\`${email}\`\n*Telepon : *\`${telepon}\`\n*Whatsapp : *\`${whatsapp}\`\n*Nosel : *\`${nosel}\`\n*Kampus : *\`${kampus}\`\n*Prodi : *\`${prodi}\`\n*Kelas : *\`${kelas}\`\n*No virtual : *\`${novirtual}\`\n*Nominal : *\`${currencyFormatter.format(nominal, { locale: 'id' })}\``

      return ctx.replyWithMarkdown(template)
    }

    return ctx.reply('Tagihan Kosong')
  })
})
bot.command('author', (ctx) => ctx.reply('https://t.me/kirintux'))
bot.launch()

const payload = JSON.stringify(
  {
    "format":"json",
    "formdata_apikey":process.env.API_KEY,
    "setdata_mod":"list-invoice",
    "formdata_status":"1",
    "formdata_filteredu":"eduNitas"
  }
)

async function getData() {
  const response = await axios.post('https://api.edunitas.com/mod/edun-medata-g', payload, {
    headers: {
      'Content-Type': 'application/json'
    }
  }).then(res => res.data)

  return response
}
