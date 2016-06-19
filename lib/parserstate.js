// -------------
// Parser States
// --------------
var BaseState = {
  name: 'BaseState',
  from: ['TaskDeclarationState', 'TaskInvocationState'],
  to: ['OpenLiteralState', 'CommentState']
}
var CommentState = {
  name: 'CommentState',
  from: ['*'],
  to: ['*']
}
// OpenLiteralState transitions to BaseState
// when as task is invoked. There is no separate
// invocation state for the same reason there isn't
// a closed task declaration state
var OpenLiteralState = {
  name: 'OpenLiteralState',
  from: ['BaseState'],
  to: ['BaseState', 'OpenBinaryState', 'CommentState']
}
var OpenBinaryState = {
  name: 'OpenBinaryState',
  from: ['OpenLiteralState'],
  to: ['TaskDeclarationState', 'CommentState']
}
var TaskDeclarationState = {
  name: 'TaskDeclarationState',
  from: ['OpenBinaryState'],
  to: ['BaseState', 'CommentState']
}

// -----------------
// Transition function
// -----------------
var transition = function(fromState, token) {

}
