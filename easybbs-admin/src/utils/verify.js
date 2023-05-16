const regs = {
  email: /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/,
  number: /^([0]|[1-9][0-9]*)$/,
  password: /^(?=.*\d)(?=.*[a-zA-Z])[\da-zA-Z~!@#$%^&*_]{8,18}$/,
}
const verify=(rule,value,reg,callback)=>{
  if(value) {
    // 校验
    if(reg.test(value)) {
      callback()
    }else {
      callback(new Error(rule.message))
    }
  }else {
    callback()
  }
}
export default {
  email: (rule,value,callback)=>{
    verify(rule,value,regs.email,callback)
  },
  number: (rule,value,callback)=>{
    verify(rule,value,regs.number,callback)
  },
  password: (rule,value,callback)=>{
    verify(rule,value,regs.password,callback)
  }
}