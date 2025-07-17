import FilterButton from './Filter.Button'

function Filter({ setFilter,filter }: { setFilter: (e: string) => any ,filter:string}) {

  let filter_list = ["All", "text", "link", "image", "file"]
  return (
    <div className='filter' >
      {filter_list.map((value, index) => <FilterButton key={index} setFilter={setFilter} filter={filter} value={value} />)}
    </div>
  )
}

export default Filter