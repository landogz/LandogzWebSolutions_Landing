<!DOCTYPE html>
<html>
<body style="font-family: system-ui, sans-serif; line-height: 1.5;">
    <h2>New contact message</h2>
    <p><strong>From:</strong> {{ $messageModel->name }} &lt;{{ $messageModel->email }}&gt;</p>
    @if($messageModel->subject)
        <p><strong>Subject:</strong> {{ $messageModel->subject }}</p>
    @endif
    <p style="white-space: pre-wrap;">{{ $messageModel->message }}</p>
</body>
</html>
