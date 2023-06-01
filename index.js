import {Markup, Telegraf, Scenes, session} from "telegraf";
import {toHex, fromHex, toBech32, fromBech32} from "@cosmjs/encoding";
import config from "config"
import CoinGecko from "coingecko-api"
import fetch from "node-fetch";
import base64 from 'base64-min';
const CoinGeckoClient = new CoinGecko();
const bot = new Telegraf(config.get('token'))
bot.use(Telegraf.log())
bot.launch();

bot.start((ctx) => ctx.reply('😊'))
let command_id_old = null
let command_id_old_info = null
let message_id_old = null
let message_id_old_info = null
let message_conversion_id = null
let command_conversion_old_id = null

const cyptobase = -1001786630776

// -1001183103754 ru

bot.command('phmn', async (ctx)=>{
    if (ctx.chat.id === cyptobase){
        if(command_id_old){
            try{
            await ctx.deleteMessage(command_id_old)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase){
        if(message_id_old){
            try{
            await ctx.deleteMessage(message_id_old)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase) {
        command_id_old = ctx.message.message_id
    }
    const junoData = await CoinGeckoClient.coins.fetch('juno-network', {});
    const atomData = await CoinGeckoClient.coins.fetch('cosmos', {});
    const JunoPrice = junoData.data.market_data.current_price.usd;
    const AtomPrice = atomData.data.market_data.current_price.usd
    const JunoSwapData= await fetch('https://api-juno.nodes.guru/wasm/contract/juno1xkm8tmm7jlqdh8kua9y7wst8fwcxpdnk6gglndfckj6rsjg4xc5q8aaawn/state');
    const JunoSwap = await JunoSwapData.json();
    const LP_JUNO = await JunoSwap.result[2].value;
    const LP_PHMN = await JunoSwap.result[3].value;
    const PHMN = await base64.decode(LP_PHMN);
    const JUNO = await base64.decode(LP_JUNO);
    const PHMN_amount = await JSON.parse(PHMN);
    const JUNO_amount = await JSON.parse(JUNO);
    const PHMN_price = await JUNO_amount.reserve / PHMN_amount.reserve * JunoPrice;
    const PHMN_for_JUNO = await JUNO_amount.reserve / PHMN_amount.reserve;
    const osmosisReq = await fetch("https://lcd.osmosis.zone/osmosis/gamm/v1beta1/pools/867/total_pool_liquidity");
    const osmosisData = await osmosisReq.json();
    console.log(osmosisData)
    const das_info = await fetch('https://api-juno.nodes.guru/wasm/contract/juno1jktfdt5g2d0fguvy8r8pl4gly7wps8phkwy08z6upc4nazkumrwq7lj0vn/state');
    const DAS = await das_info.json();
    const last_row_DAS = DAS.result[DAS.result.length - 1];
    const data_das = base64.decode(last_row_DAS.value)
    const lock_das_phmn = JSON.parse(data_das)
    console.log(lock_das_phmn)
    const atom = await osmosisData.liquidity[0].amount
    const phmn = await osmosisData.liquidity[1].amount
    console.log(phmn)
    const {message_id} = await ctx.replyWithHTML(`
<strong>ATOM price:</strong> ${AtomPrice}$
<strong>JUNO price:</strong> ${JunoPrice}$
<strong>PHMN-ATOM price:</strong> ${(atom/phmn*AtomPrice).toFixed(2)}$
1 $PHMN  = ${(atom / phmn ).toFixed(2)} $ATOM
<strong>PHMN-JUNO price:</strong> ${PHMN_price.toFixed(2)}$
1 $PHMN  = ${PHMN_for_JUNO.toFixed(2)} $JUNO

<strong>PHMN lock in DAS: </strong> ${(lock_das_phmn / 1000000).toFixed(2)} <strong>$PHMN</strong>` )

    if (ctx.chat.id === cyptobase) {
        message_id_old = message_id
    }
});

bot.command('info', async (ctx) => {

    if (ctx.chat.id === cyptobase){
        if(message_id_old_info){
            try{
            await ctx.deleteMessage(message_id_old_info)}catch (err){}
        }
    }
    if (ctx.chat.id === cyptobase){
        if(command_id_old_info){
            try{
            await ctx.deleteMessage(command_id_old_info)}catch (err){}
        }
    }
    if (ctx.chat.id === cyptobase) {
        command_id_old_info = ctx.message.message_id
    }
    const {message_id} = await ctx.replyWithHTML(`<strong>PHMN contract address:</strong> <code>juno1rws84uz7969aaa7pej303udhlkt3j9ca0l3egpcae98jwak9quzq8szn2l</code>`,
        Markup.inlineKeyboard([
            [Markup.button.url("Dashboard","https://phmn-stats.posthuman.digital"), Markup.button.url("PHMN docs","https://antropocosmist.medium.com/phmn-tokenomics-f3b7116331e6")],
            [Markup.button.url("DAS","https://daodao.zone/dao/juno1h5ex5dn62arjwvwkh88r475dap8qppmmec4sgxzmtdn5tnmke3lqwpplgg"), Markup.button.url("Discord", "https://discord.gg/4xsuADrA"), Markup.button.url("Crew3", "https://posthumandvs.crew3.xyz/questboard")]
        ]))

    if (ctx.chat.id === cyptobase) {
        message_id_old_info = message_id
    }
})
//conversion scene

const AddressConversionScene = new Scenes.BaseScene('conversion');
let address = []

AddressConversionScene.on('text', async ctx => {
    try {
        if (ctx.message.entities[0].type === 'bot_command'){
            await ctx.scene.leave()
        }
    }catch (err){}

    if (ctx.chat.id > 0){
        try {
            let hex_address = toHex(fromBech32(`${ctx.message.text}`).data)
            address.cerberus = toBech32(`cerberus`, fromHex(`${hex_address}`));
            address.cosmos = toBech32(`cosmos`, fromHex(`${hex_address}`));
            address.chihuahua = toBech32(`chihuahua`, fromHex(`${hex_address}`));
            address.comdex = toBech32(`comdex`, fromHex(`${hex_address}`));
            address.bostrom = toBech32(`bostrom`, fromHex(`${hex_address}`));
            address.fetch = toBech32(`fetch`, fromHex(`${hex_address}`));
            address.juno = toBech32(`juno`, fromHex(`${hex_address}`));
            address.ki = toBech32(`ki`, fromHex(`${hex_address}`));
            address.like = toBech32(`like`, fromHex(`${hex_address}`));
            address.mantle = toBech32(`mantle`, fromHex(`${hex_address}`));
            address.odin = toBech32(`odin`, fromHex(`${hex_address}`));
            address.osmo = toBech32(`osmo`, fromHex(`${hex_address}`));
            address.rizon = toBech32(`rizon`, fromHex(`${hex_address}`));
            address.sif = toBech32(`sif`, fromHex(`${hex_address}`));
            address.stars = toBech32(`stars`, fromHex(`${hex_address}`));
            address.umee = toBech32(`umee`, fromHex(`${hex_address}`));
            address.tori = toBech32(`tori`, fromHex(`${hex_address}`));
            address.flix = toBech32(`omniflix`, fromHex(`${hex_address}`));

            await ctx.replyWithHTML(`Cerberus: 
<code>${address.cerberus}</code> 
Cosmos HUB: 
<code>${address.cosmos}</code>
Chihuahua: 
<code>${address.chihuahua}</code>
Comdex: 
<code>${address.comdex}</code>
Bostrom: 
<code>${address.bostrom}</code>
FetchAI: 
<code>${address.fetch}</code>
Juno: 
<code>${address.juno}</code>
Ki-chain: 
<code>${address.ki}</code>
Like: 
<code>${address.like}</code>
AssetMantle: 
<code>${address.mantle}</code>
Odin protocol: 
<code>${address.odin}</code>
Osmosis: 
<code>${address.osmo}</code>
Rizon: 
<code>${address.rizon}</code>
Sifchain: 
<code>${address.sif}</code>
Stargaze: 
<code>${address.stars}</code>
Umee: 
<code>${address.umee}</code>
Teritori:
<code>${address.tori}</code>
Omniflix
<code>${address.flix}</code>
`)
            await ctx.scene.leave()
        }catch (err){
            if (err != null){
                await ctx.scene.leave()
            }
        }
    }
})

AddressConversionScene.on('message', async ctx=>{
    await ctx.scene.reenter()
})

const stage = new Scenes.Stage([AddressConversionScene]);
bot.use(session())
bot.use(stage.middleware());

bot.command('conversion', async ctx => {

    // console.log(ctx.message.entities[0].type)

    if (ctx.chat.id === cyptobase){
        if(command_conversion_old_id){
            try{
                await ctx.deleteMessage(command_conversion_old_id)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase){
        if(message_conversion_id){
            try{
                await ctx.deleteMessage(message_conversion_id)}catch (err){}
        }
    }

    if (ctx.chat.id === cyptobase) {
        try {
            command_conversion_old_id = ctx.message.message_id
        }catch (err){}
    }


    if (ctx.chat.id > 0) {
        await ctx.reply('Hello. Send me address for conversion!' +
            ' You can get address in another networks')
        await ctx.scene.enter('conversion')
    } else {
        const {message_id} = await ctx.reply('This function used only in direct messages!')
        if (ctx.chat.id === cyptobase) {
            message_conversion_id = message_id
        }
    }

});
