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
var OpenLiteralState = {
  name: 'OpenLiteralState',
  from: ['BaseState'],
  to: ['OpenBinaryState', 'TaskInvocationState', 'CommentState']
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
var TaskInvocationState = {
  name: 'TaskInvocationState',
  from: ['OpenLiteralState'],
  to: ['BaseState', 'CommentState']
}
