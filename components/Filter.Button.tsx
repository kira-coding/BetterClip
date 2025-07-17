
function FilterButton({ setFilter, value, filter }: { setFilter: (e: string) => any, value: string, filter: string }) {

  return (
    <button className={filter == value ? 'outline-none border-none p-2 px-4 font-semibold m-2 bg-primary text-tone rounded-md' : 'outline-none border-none p-2 px-4 font-semibold m-2 bg-accent text-primary rounded-md'} onClick={() => { setFilter(value) }}>
      
      {value}</button>
  )
}

export default FilterButton