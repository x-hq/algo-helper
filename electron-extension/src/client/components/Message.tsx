type Props = {
    message: MessageEvent<string>
}
export const Message: React.FC<Props> = ({ message, ...rest }) => {
    return <div {...rest} className="border-2 p-2 my-2 rounded-xl border-slate-600 text-xs"><pre className="whitespace-break-spaces">{message ? message.data : null}</pre></div>
}