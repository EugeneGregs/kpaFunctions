module.exports = function(environment){
    return environment == "localhost" ? 'http://localhost:7071/api/' : ""
}