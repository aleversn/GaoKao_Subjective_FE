export class SpeakData {
  
    /**
     *
     * @param {String} data 语音base64数据
     */ 
    constructor(data = undefined){
        this.data = data
    }
       
    /**
     * 语音base64数据
     * @type {String}
     */
    data=undefined
    
}
export class StdResponse {
  
    /**
     *
     * @param {String} message 
     * @param {Number} code 
     * @param {undefined} data 
     * @param {Array} errors 
     */ 
    constructor(message = undefined,code = undefined,data = undefined,errors = undefined){
        this.message = message
        this.code = code
        this.data = data
        this.errors = errors
    }
       
    /**
     * 
     * @type {String}
     */
    message=undefined   
    /**
     * 
     * @type {Number}
     */
    code=undefined   
    /**
     * 
     * @type {undefined}
     */
    data=undefined   
    /**
     * 
     * @type {Array}
     */
    errors=undefined
    
}
export class UserRegister {
  
    /**
     *
     * @param {String} name 姓名
     * @param {String} password 密码
     * @param {String} email 邮箱
     * @param {String} phone 手机号码
     * @param {String} nickname 昵称
     */ 
    constructor(name = undefined,password = undefined,email = undefined,phone = undefined,nickname = undefined){
        this.name = name
        this.password = password
        this.email = email
        this.phone = phone
        this.nickname = nickname
    }
       
    /**
     * 姓名
     * @type {String}
     */
    name=undefined   
    /**
     * 密码
     * @type {String}
     */
    password=undefined   
    /**
     * 邮箱
     * @type {String}
     */
    email=undefined   
    /**
     * 手机号码
     * @type {String}
     */
    phone=undefined   
    /**
     * 昵称
     * @type {String}
     */
    nickname=undefined
    
}
export class UserUpdatePassword {
  
    /**
     *
     * @param {String} password 用户的密码
     * @param {String} code 用户的验证码
     */ 
    constructor(password = undefined,code = undefined){
        this.password = password
        this.code = code
    }
       
    /**
     * 用户的密码
     * @type {String}
     */
    password=undefined   
    /**
     * 用户的验证码
     * @type {String}
     */
    code=undefined
    
}
export class UserLogin {
  
    /**
     *
     * @param {String} id 用户的Id
     * @param {String} password 用户的密码
     * @param {String} code 验证码
     */ 
    constructor(id = undefined,password = undefined,code = undefined){
        this.id = id
        this.password = password
        this.code = code
    }
       
    /**
     * 用户的Id
     * @type {String}
     */
    id=undefined   
    /**
     * 用户的密码
     * @type {String}
     */
    password=undefined   
    /**
     * 验证码
     * @type {String}
     */
    code=undefined
    
}
export class RoleRequest {
  
    /**
     *
     * @param {String} name 名称
     * @param {String} description 描述
     */ 
    constructor(name = undefined,description = undefined){
        this.name = name
        this.description = description
    }
       
    /**
     * 名称
     * @type {String}
     */
    name=undefined   
    /**
     * 描述
     * @type {String}
     */
    description=undefined
    
}
export class UserUpdate {
  
    /**
     *
     * @param {String} name 用户的真实名字
     * @param {String} nickName 用户的昵称
     * @param {String} birth 用户出生的时间
     * @param {String} gender 用户的性别MALE/FEMALE
     * @param {String} email 用户的邮箱
     * @param {String} phone 手机号码
     * @param {String} config 用户配置
     */ 
    constructor(name = undefined,nickName = undefined,birth = undefined,gender = undefined,email = undefined,phone = undefined,config = undefined){
        this.name = name
        this.nickName = nickName
        this.birth = birth
        this.gender = gender
        this.email = email
        this.phone = phone
        this.config = config
    }
       
    /**
     * 用户的真实名字
     * @type {String}
     */
    name=undefined   
    /**
     * 用户的昵称
     * @type {String}
     */
    nickName=undefined   
    /**
     * 用户出生的时间
     * @type {String}
     */
    birth=undefined   
    /**
     * 用户的性别MALE/FEMALE
     * @type {String}
     */
    gender=undefined   
    /**
     * 用户的邮箱
     * @type {String}
     */
    email=undefined   
    /**
     * 手机号码
     * @type {String}
     */
    phone=undefined   
    /**
     * 用户配置
     * @type {String}
     */
    config=undefined
    
}
export class UpdateAvatarRequest {
  
    /**
     *
     * @param {String} avatar 头像
     */ 
    constructor(avatar = undefined){
        this.avatar = avatar
    }
       
    /**
     * 头像
     * @type {String}
     */
    avatar=undefined
    
}
export class EmailRequest {
  
    /**
     *
     * @param {String} username 用户名
     * @param {String} password 密码
     * @param {String} smtphost 邮箱的smtp地址
     * @param {Number} smtpport SMTP端口
     * @param {String} imaphost imap地址
     * @param {Number} imapport imap端口
     * @param {undefined} smtpssl 是否启用smtp的ssl加密
     * @param {undefined} imapssl 是否启用imap的ssl加密
     */ 
    constructor(username = undefined,password = undefined,smtphost = undefined,smtpport = undefined,imaphost = undefined,imapport = undefined,smtpssl = undefined,imapssl = undefined){
        this.username = username
        this.password = password
        this.smtphost = smtphost
        this.smtpport = smtpport
        this.imaphost = imaphost
        this.imapport = imapport
        this.smtpssl = smtpssl
        this.imapssl = imapssl
    }
       
    /**
     * 用户名
     * @type {String}
     */
    username=undefined   
    /**
     * 密码
     * @type {String}
     */
    password=undefined   
    /**
     * 邮箱的smtp地址
     * @type {String}
     */
    smtphost=undefined   
    /**
     * SMTP端口
     * @type {Number}
     */
    smtpport=undefined   
    /**
     * imap地址
     * @type {String}
     */
    imaphost=undefined   
    /**
     * imap端口
     * @type {Number}
     */
    imapport=undefined   
    /**
     * 是否启用smtp的ssl加密
     * @type {undefined}
     */
    smtpssl=undefined   
    /**
     * 是否启用imap的ssl加密
     * @type {undefined}
     */
    imapssl=undefined
    
}
export class AddEmailTemplateModel {
  
    /**
     *
     * @param {String} name 模版名称
     * @param {String} subject 模版主题
     * @param {String} content 模版内容
     * @param {undefined} variables 模版变量
     */ 
    constructor(name = undefined,subject = undefined,content = undefined,variables = undefined){
        this.name = name
        this.subject = subject
        this.content = content
        this.variables = variables
    }
       
    /**
     * 模版名称
     * @type {String}
     */
    name=undefined   
    /**
     * 模版主题
     * @type {String}
     */
    subject=undefined   
    /**
     * 模版内容
     * @type {String}
     */
    content=undefined   
    /**
     * 模版变量
     * @type {undefined}
     */
    variables=undefined
    
}
export class UpdateEmailTemplateModel {
  
    /**
     *
     * @param {String} name 模版名称
     * @param {String} subject 模版主题
     * @param {String} content 模版内容
     * @param {undefined} variables 模版变量
     */ 
    constructor(name = undefined,subject = undefined,content = undefined,variables = undefined){
        this.name = name
        this.subject = subject
        this.content = content
        this.variables = variables
    }
       
    /**
     * 模版名称
     * @type {String}
     */
    name=undefined   
    /**
     * 模版主题
     * @type {String}
     */
    subject=undefined   
    /**
     * 模版内容
     * @type {String}
     */
    content=undefined   
    /**
     * 模版变量
     * @type {undefined}
     */
    variables=undefined
    
}
export class AddWebsiteConfigDTO {
  
    /**
     *
     * @param {String} name 网站配置名称
     * @param {String} value 网站配置值
     * @param {String} permission 网站配置可视权限
     */ 
    constructor(name = undefined,value = undefined,permission = undefined){
        this.name = name
        this.value = value
        this.permission = permission
    }
       
    /**
     * 网站配置名称
     * @type {String}
     */
    name=undefined   
    /**
     * 网站配置值
     * @type {String}
     */
    value=undefined   
    /**
     * 网站配置可视权限
     * @type {String}
     */
    permission=undefined
    
}
export class AddModelQuickQuestion {
  
    /**
     *
     * @param {String} question 快捷指令
     * @param {String} tag 标签
     */ 
    constructor(question = undefined,tag = undefined){
        this.question = question
        this.tag = tag
    }
       
    /**
     * 快捷指令
     * @type {String}
     */
    question=undefined   
    /**
     * 标签
     * @type {String}
     */
    tag=undefined
    
}
export class UpdateModelQuickQuestion {
  
    /**
     *
     * @param {String} question 快捷指令
     * @param {String} tag 标签
     */ 
    constructor(question = undefined,tag = undefined){
        this.question = question
        this.tag = tag
    }
       
    /**
     * 快捷指令
     * @type {String}
     */
    question=undefined   
    /**
     * 标签
     * @type {String}
     */
    tag=undefined
    
}
export class ModelPriceRequest {
  
    /**
     *
     * @param {Number} promptPrice 输入提示定价，单位是分
     * @param {Number} completionPrice 输出定价，单位是分
     */ 
    constructor(promptPrice = undefined,completionPrice = undefined){
        this.promptPrice = promptPrice
        this.completionPrice = completionPrice
    }
       
    /**
     * 输入提示定价，单位是分
     * @type {Number}
     */
    promptPrice=undefined   
    /**
     * 输出定价，单位是分
     * @type {Number}
     */
    completionPrice=undefined
    
}
export class ChatRequest {
  
    /**
     *
     * @param {String} name 对话的名称
     */ 
    constructor(name = undefined){
        this.name = name
    }
       
    /**
     * 对话的名称
     * @type {String}
     */
    name=undefined
    
}
export class AddModelParams {
  
    /**
     *
     * @param {Number} maxLength 模型支持的最大Token长度
     * @param {String} modelType 模型的类型：GRPC｜OPENAI
     * @param {String} endpoint 模型的请求端点，只有是GRPC才有此项
     * @param {String} welcome 模型的欢迎词
     * @param {String} goodbye 模型的结束语
     * @param {undefined} enableQuickCommand 是否启用快速指令
     * @param {undefined} alwayShowQuickCommand 快捷指令是否总是可见
     * @param {undefined} enableSpeechInput 是否启用语音输入
     * @param {undefined} enableDigitalHuman 是否启用数字人
     * @param {undefined} expandComment 是否展开评论
     * @param {String} nickname 模型的昵称
     * @param {String} avatar 模型的头像
     * @param {String} title 模型的标题
     * @param {String} background 模型的背景
     */ 
    constructor(maxLength = undefined,modelType = undefined,endpoint = undefined,welcome = undefined,goodbye = undefined,enableQuickCommand = undefined,alwayShowQuickCommand = undefined,enableSpeechInput = undefined,enableDigitalHuman = undefined,expandComment = undefined,nickname = undefined,avatar = undefined,title = undefined,background = undefined){
        this.maxLength = maxLength
        this.modelType = modelType
        this.endpoint = endpoint
        this.welcome = welcome
        this.goodbye = goodbye
        this.enableQuickCommand = enableQuickCommand
        this.alwayShowQuickCommand = alwayShowQuickCommand
        this.enableSpeechInput = enableSpeechInput
        this.enableDigitalHuman = enableDigitalHuman
        this.expandComment = expandComment
        this.nickname = nickname
        this.avatar = avatar
        this.title = title
        this.background = background
    }
       
    /**
     * 模型支持的最大Token长度
     * @type {Number}
     */
    maxLength=undefined   
    /**
     * 模型的类型：GRPC｜OPENAI
     * @type {String}
     */
    modelType=undefined   
    /**
     * 模型的请求端点，只有是GRPC才有此项
     * @type {String}
     */
    endpoint=undefined   
    /**
     * 模型的欢迎词
     * @type {String}
     */
    welcome=undefined   
    /**
     * 模型的结束语
     * @type {String}
     */
    goodbye=undefined   
    /**
     * 是否启用快速指令
     * @type {undefined}
     */
    enableQuickCommand=undefined   
    /**
     * 快捷指令是否总是可见
     * @type {undefined}
     */
    alwayShowQuickCommand=undefined   
    /**
     * 是否启用语音输入
     * @type {undefined}
     */
    enableSpeechInput=undefined   
    /**
     * 是否启用数字人
     * @type {undefined}
     */
    enableDigitalHuman=undefined   
    /**
     * 是否展开评论
     * @type {undefined}
     */
    expandComment=undefined   
    /**
     * 模型的昵称
     * @type {String}
     */
    nickname=undefined   
    /**
     * 模型的头像
     * @type {String}
     */
    avatar=undefined   
    /**
     * 模型的标题
     * @type {String}
     */
    title=undefined   
    /**
     * 模型的背景
     * @type {String}
     */
    background=undefined
    
}
export class UpdateModelParams {
  
    /**
     *
     * @param {String} goodbye 结束词
     * @param {String} welcome 欢迎词
     * @param {undefined} enableQuickCommand 是否启用快捷指令
     * @param {undefined} enableSpeechInput 是否启用语音输入
     * @param {undefined} enableDigitalHuman 是否启用数字人
     * @param {undefined} expandComment 是否展开评论
     * @param {String} nickname 模型的昵称
     * @param {String} avatar 模型的头像
     * @param {String} title 模型的标题
     * @param {undefined} alwayShowQuickCommand 快捷指令是否总是可见
     * @param {String} background 模型的背景
     */ 
    constructor(goodbye = undefined,welcome = undefined,enableQuickCommand = undefined,enableSpeechInput = undefined,enableDigitalHuman = undefined,expandComment = undefined,nickname = undefined,avatar = undefined,title = undefined,alwayShowQuickCommand = undefined,background = undefined){
        this.goodbye = goodbye
        this.welcome = welcome
        this.enableQuickCommand = enableQuickCommand
        this.enableSpeechInput = enableSpeechInput
        this.enableDigitalHuman = enableDigitalHuman
        this.expandComment = expandComment
        this.nickname = nickname
        this.avatar = avatar
        this.title = title
        this.alwayShowQuickCommand = alwayShowQuickCommand
        this.background = background
    }
       
    /**
     * 结束词
     * @type {String}
     */
    goodbye=undefined   
    /**
     * 欢迎词
     * @type {String}
     */
    welcome=undefined   
    /**
     * 是否启用快捷指令
     * @type {undefined}
     */
    enableQuickCommand=undefined   
    /**
     * 是否启用语音输入
     * @type {undefined}
     */
    enableSpeechInput=undefined   
    /**
     * 是否启用数字人
     * @type {undefined}
     */
    enableDigitalHuman=undefined   
    /**
     * 是否展开评论
     * @type {undefined}
     */
    expandComment=undefined   
    /**
     * 模型的昵称
     * @type {String}
     */
    nickname=undefined   
    /**
     * 模型的头像
     * @type {String}
     */
    avatar=undefined   
    /**
     * 模型的标题
     * @type {String}
     */
    title=undefined   
    /**
     * 快捷指令是否总是可见
     * @type {undefined}
     */
    alwayShowQuickCommand=undefined   
    /**
     * 模型的背景
     * @type {String}
     */
    background=undefined
    
}
export class MessageScoreRequest {
  
    /**
     *
     * @param {Number} score 消息的分数
     */ 
    constructor(score = undefined){
        this.score = score
    }
       
    /**
     * 消息的分数
     * @type {Number}
     */
    score=undefined
    
}
export class MessageCommentRequest {
  
    /**
     *
     * @param {String} comment 消息的评价
     */ 
    constructor(comment = undefined){
        this.comment = comment
    }
       
    /**
     * 消息的评价
     * @type {String}
     */
    comment=undefined
    
}
export class MessageRequest {
  
    /**
     *
     * @param {String} role 聊天信息的角色
     * @param {String} content 聊天的内容
     * @param {String} parentId 上一条消息的Id
     */ 
    constructor(role = undefined,content = undefined,parentId = undefined){
        this.role = role
        this.content = content
        this.parentId = parentId
    }
       
    /**
     * 聊天信息的角色
     * @type {String}
     */
    role=undefined   
    /**
     * 聊天的内容
     * @type {String}
     */
    content=undefined   
    /**
     * 上一条消息的Id
     * @type {String}
     */
    parentId=undefined
    
}
export class SseEmitter {
  
    /**
     *
     * @param {Number} timeout 
     */ 
    constructor(timeout = undefined){
        this.timeout = timeout
    }
       
    /**
     * 
     * @type {Number}
     */
    timeout=undefined
    
}
