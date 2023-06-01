// import {Scenes, Markup} from "telegraf";
// import {toHex, fromHex, toBech32, fromBech32} from "@cosmjs/encoding";
//
//
// class SceneGenerator{
//     ConversionScene (){
//         const conversion = new Scenes.BaseScene('conversion')
//         conversion.enter(async (ctx) => {
//             await ctx.reply("Какие адреса вы хотите получить?")
//             Markup.inlineKeyboard([
//                 [Markup.button.callback('For validator', () =>{ctx.scene.enter('validator')})]
//             ])
//         })
//         const validator = new Scenes.BaseScene('validator')
//         validator.enter(async (ctx)=>{
//             await ctx.reply("Введите адрес, которых хотите конвертировать")
//         })
//         const {message_id} = validator.on('text', ctx => {
//             ctx.reply()
//         })
//     }
//
// }
//
//
// module.export = Scenes