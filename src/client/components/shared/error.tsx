type Props = {
    title?: string;
    error: Error;
};
export const Error = ({ error, title = "Something went wrong" }: Props) => (
    <div className="flex h-full flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-bold">{title}</h1>
        <p className="text-lg text-gray-500">{error.message}</p>
    </div>
);
