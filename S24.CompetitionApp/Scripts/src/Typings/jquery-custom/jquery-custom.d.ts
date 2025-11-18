

interface JQuery {
   /**
    * Initialize a multisortable
    */
   multisortable(obj: any): JQuery;

   /**
   * Initialize a bootgrid
   */
   bootgrid(obj: any): JQuery;

   /**
   * Initialize a dataTable
   */
   dataTable(obj: any): JQuery;

   /**
   * Initialize a cleditor
   */
   cleditor(): JQuery;
    cleditor(p1: { fonts: string });
   
  }