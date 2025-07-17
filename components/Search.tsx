function Search({ setTerm, term }: { setTerm: (e: any) => any, term: string }) {

  return (
    <>
      <input type="text" className='rounded-2xl rounded-bl-none outline-none  bg-primary text-tone placeholder-secondary font-medium text-xl p-2 ' placeholder="Search Clipboard" value={term} onChange={(e) => { setTerm(e.target.value) }} />
    </>
  )
}

export default Search   